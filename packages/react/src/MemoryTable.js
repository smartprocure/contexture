import Contexture from 'contexture'
import memory from 'contexture/src/provider-memory'
import types from 'contexture/src/provider-memory/exampleTypes'
import { observer } from 'mobx-react'
import React from 'react'
import ContextureMobx from './utils/contexture-mobx'
import { ResultTable } from './exampleTypes'

let MemoryTable = ({ data, fields, pageSize = 10, ...props }) => {
  let service = Contexture({
    debug: true,
    schemas: { schema: { memory: { records: data } } },
    providers: { memory: { ...memory, types: types() } },
  })
  let tree = ContextureMobx({ service })({
    key: 'root',
    schema: 'schema',
    children: [{ key: 'results', type: 'results', pageSize }],
  })
  tree.refresh(['root'])
  return (
    <ResultTable path={['root', 'results']} {...{ fields, tree, ...props }} />
  )
}

export default observer(MemoryTable)
