import Contexture from 'contexture'
import memory from 'contexture/src/provider-memory'
import types from 'contexture/src/provider-memory/exampleTypes'
import React from 'react'
import ContextureMobx from './utils/contexture-mobx'
import { componentForType } from './utils/schema'
import { ResultTable, TypeMap } from './exampleTypes'

export let useMemoryTree = ({
  records,
  debug,
  resultNode = {
    pageSize: 50,
  },
  criteriaNodes = [],
} = {}) => {
  let [memoryStorage] = React.useState({ records: [] })
  let [tree] = React.useState(() =>
    ContextureMobx({
      debounce: 0,
      service: Contexture({
        debug,
        schemas: { data: { memory: memoryStorage } },
        providers: { memory: { ...memory, types: types() } },
      }),
    })({
      key: 'root',
      schema: 'data',
      children: [
        { key: 'results', type: 'results', ...resultNode },
        { key: 'criteria', type: 'group', children: criteriaNodes },
      ],
    })
  )

  let updateMemory = async data => {
    let records = await data
    if (records !== memoryStorage.records) {
      memoryStorage.records = records
      tree.refresh(['root'])
    }
  }
  updateMemory(records)

  return tree
}

let MemoryTable = ({ data, debug, resultNode, criteriaNodes, ...props }) => {
  let tree = useMemoryTree({
    records: data,
    debug,
    resultNode,
    criteriaNodes,
  })

  return (
    <ResultTable
      tree={tree}
      path={['root', 'results']}
      criteria={['root', 'criteria']}
      mapNodeToProps={componentForType(TypeMap)}
      {...props}
    />
  )
}

export default MemoryTable
