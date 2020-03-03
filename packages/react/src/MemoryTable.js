import Contexture from 'contexture'
import memory from 'contexture/src/provider-memory'
import types from 'contexture/src/provider-memory/exampleTypes'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import React from 'react'
import ContextureMobx from './utils/contexture-mobx'
import { componentForType } from './utils/schema'
import { ResultTable, TypeMap } from './exampleTypes'

export let memoryService = (records, { schema, debug } = {}) =>
  Contexture({
    debug,
    // Hack to effectively set a default schema: if our tree root doesn't have
    // a `schema` property, it will get the schema at key `undefined`.
    schemas: { [schema]: { memory: { records } } },
    providers: { memory: { ...memory, types: types() } },
  })

let nodeProps = ['pageSize', 'page', 'sortField', 'sortDir', 'include']
let MemoryTable = ({ data, fields, debug, ...props }) => {
  let service = memoryService(data, { schema: 'data', debug })
  let [tree] = React.useState(
    ContextureMobx({ service })({
      key: 'root',
      schema: 'data',
      children: [
        { key: 'results', type: 'results', ..._.pick(nodeProps, props) },
        { key: 'criteria', type: 'group', children: [] },
      ],
    })
  )
  tree.refresh(['root'])
  return (
    <ResultTable
      path={['root', 'results']}
      criteria={['root', 'criteria']}
      mapNodeToProps={componentForType(TypeMap)}
      {...{ fields, tree, ..._.omit(nodeProps, props) }}
    />
  )
}

export default observer(MemoryTable)
