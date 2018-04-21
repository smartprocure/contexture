import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observable } from 'mobx'
import { fromPromise } from 'mobx-utils'
import { Provider, observer } from 'mobx-react'

import { Awaiter } from '../../src/layout/'
import QueryBuilder from '../../src/queryBuilder/'
import { getESSchemas } from '../../src/utils/schema'
import ExampleTypes from '../../src/exampleTypes/'
import { Input } from '../DemoControls'
let { ResultCount, ResultTable, TypeMap } = ExampleTypes({ Input })

import Contexture, { es, schemas, updateClient } from './contexture'

let state = observable({
  url: '',
  schemas: null,
  tree: {},
})
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
        children: [
          {
            key: 'firstFilter',
            type: null,
            field: null,
          },
        ],
      },
      {
        key: 'results',
        type: 'results',
        pageSize: 10,
        page: 1,
      },
    ],
  })
}

let updateEs = host => {
  state.url = host
  updateClient({ host, apiVersion: '6.0' })
  state.schemas = fromPromise(
    getESSchemas(es.client).then(x => {
      F.extendOn(
        schemas,
        _.mapValues(
          ({ esIndex, esType, notAnalyzedField }) => ({
            elasticsearch: { index: esIndex, type: esType },
            modeMap: {
              word: '',
              autocomplete: `.${notAnalyzedField}`,
            },
          }),
          x
        )
      )
      changeSchema(_.keys(x)[0])
      return x
    })
  )
}

updateEs('https://public-es-demo.smartprocure.us/')

// Just to make an observer
let With = observer(({ state, children }) => <div>{children(state)}</div>)
let Debug = ({ value }) => <pre>{JSON.stringify(value, null, 2)}</pre>

export default () => (
  <With state={state}>
    {({ tree, schemas }) => (
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
                      x => <option key={x}>{x}</option>,
                      _.sortBy(_.identity, _.keys(schemas))
                    )}
                  </select>
                  <Provider tree={tree} types={TypeMap}>
                    <div>
                      <QueryBuilder
                        fields={schemas[tree.tree.schema].fields}
                        path={['root', 'criteria']}
                      />
                      <ResultCount path={['root', 'results']} />
                      <ResultTable path={['root', 'results']} infer />
                    </div>
                  </Provider>
                  <Debug value={tree} />
                </div>
              )
            }
          </Awaiter>
        )}
      </div>
    )}
  </With>
)
