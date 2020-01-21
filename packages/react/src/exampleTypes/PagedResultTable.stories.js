import _ from 'lodash/fp'
import React from 'react'
import ThemePicker from '../stories/themePicker'
import PagedResultTable from './PagedResultTable'
import { Observer } from 'mobx-react'

import Contexture from 'contexture'
import ContextureMobx from '../utils/contexture-mobx'
import memory from 'contexture/src/provider-memory'
import types from 'contexture/src/provider-memory/exampleTypes'

export default {
  title: 'ExampleTypes | PagedResultTable',
  component: PagedResultTable,
  decorators: [ThemePicker('greyVest')],
}

let data = _.times(x => ({ _id: x, value: _.random(0, 20000) }), 200)

let tree = {
  key: 'root',
  schema: 'test',
  children: [{ key: 'results', type: 'results', pageSize: 5 }],
}
let service = Contexture({
  debug: true,
  schemas: { test: { memory: { records: data } } },
  providers: { memory: { ...memory, types: types() } },
})
let search = ContextureMobx({ service })(tree)
search.refresh(['root'])

export let story = () => (
  <div>
    <button onClick={() => search.refresh(['root'])}>refresh</button>
    <Observer>
      {() => (
        <PagedResultTable
          fields={{ _id: { label: 'id' }, value: { label: 'val' } }}
          tree={search}
          path={['root', 'results']}
        />
      )}
    </Observer>
  </div>
)
