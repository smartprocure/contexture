import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observable } from 'mobx'
import { fromPromise } from 'mobx-utils'
import { observer } from 'mobx-react'

import { Awaiter, Flex, QueryBuilder } from '../../src/'
import { Input, ExampleTypes } from '../DemoControls'
let { ResultCount, ResultTable, TypeMap } = ExampleTypes

import Contexture, { updateClient } from './contexture'

let state = observable({
  url: '',
  schemas: null,
  tree: {},
  savedSearch: '',
  showDebug: false,
})
let save = () => {
  state.savedSearch = JSON.stringify(state.tree.serialize(), null, 2)
}
let load = () => {
  state.tree = Contexture(JSON.parse(state.savedSearch))
  state.tree.refresh()
}

let changeSchema = schema => {
  state.tree = Contexture({
    key: 'root',
    type: 'group',
    join: 'and',
    schema,
    children: [
      {
        key: 'criteria',
        type: 'group',
        join: 'and',
        children: [{ key: 'firstFilter' }],
      },
      {
        key: 'results',
        type: 'results',
        page: 1,
      },
    ],
  })
}

let updateEs = host => {
  state.url = host
  state.schemas = fromPromise(
    updateClient({ host }).then(x => {
      changeSchema(_.keys(x)[0])
      return x
    })
  )
}

updateEs('https://public-es-demo.smartprocure.us/')

let Debug = ({ value }) => <pre>{JSON.stringify(value, null, 2)}</pre>

let Story = observer(() => {
  let { tree, schemas } = state
  return (
    <div>
      <Input value={state.url} onChange={e => updateEs(e.target.value)} />
      {schemas && (
        <Awaiter promise={schemas}>
          {schemas =>
            _.get('tree.schema', tree) && (
              <div>
                <select
                  value={tree.schema}
                  onChange={e => changeSchema(e.target.value)}
                >
                  {_.map(
                    x => (
                      <option key={x}>{x}</option>
                    ),
                    _.sortBy(_.identity, _.keys(schemas))
                  )}
                </select>
                <button onClick={save}>Save</button>
                <button onClick={load}>Load</button>
                <button onClick={F.flip(F.lensProp('showDebug', state))}>
                  {state.showDebug ? 'Hide' : 'Show'} Dev Panel
                </button>
                {state.showDebug && (
                  <Flex>
                    <textarea
                      style={{ width: '50%' }}
                      value={state.savedSearch}
                      onChange={e => {
                        state.savedSearch = e.target.value
                      }}
                    />
                    <Debug style={{ width: '50%' }} value={tree} />
                  </Flex>
                )}
                <div>
                  <QueryBuilder
                    tree={tree}
                    types={TypeMap}
                    fields={schemas[tree.tree.schema].fields}
                    path={['root', 'criteria']}
                  />
                  <ResultCount tree={tree} path={['root', 'results']} />
                  <ResultTable
                    tree={tree}
                    path={['root', 'results']}
                    fields={schemas[tree.tree.schema].fields}
                  />
                </div>
              </div>
            )
          }
        </Awaiter>
      )}
    </div>
  )
})

export default () => <Story />
