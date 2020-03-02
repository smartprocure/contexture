import Contexture from 'contexture'
import memory from 'contexture/src/provider-memory'
import types from 'contexture/src/provider-memory/exampleTypes'
import { observer } from 'mobx-react'
import React from 'react'
import ContextureMobx from './utils/contexture-mobx'
import { ResultTable } from './exampleTypes'

export let memoryService = (records, { debug }) =>
  Contexture({
    debug,
    // Hack to effectively set a default schema: if our tree root doesn't have
    // a `schema` property, it will get the schema at key `undefined`.
    schemas: { undefined: { memory: { records } } },
    providers: { memory: { ...memory, types: types() } },
  })

let MemoryTable = ({ data, fields, pageSize = 10, debug, ...props }) => {
  let service = memoryService(data, { debug })
  let tree = ContextureMobx({ service })({
    key: 'root',
    children: [{ key: 'results', type: 'results', pageSize }],
  })
  tree.refresh(['root'])
  return (
    <ResultTable path={['root', 'results']} {...{ fields, tree, ...props }} />
  )
}

export default observer(MemoryTable)
