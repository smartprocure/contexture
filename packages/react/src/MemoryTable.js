import _ from 'lodash/fp'
import Contexture from 'contexture'
import memory from 'contexture/src/provider-memory'
import types from 'contexture/src/provider-memory/exampleTypes'
import React, { useState, useEffect } from 'react'
import ContextureMobx from './utils/contexture-mobx'
import { componentForType } from './utils/schema'
import { ResultTable, TypeMap } from './exampleTypes'

export let useMemoryTree = ({
  records,
  debug,
  resultsNode = {
    pageSize: 50,
  },
  criteriaNodes = [],
} = {}) => {
  let [memoryStorage] = useState({ records: [] })
  let [tree, setTree] = useState({})

  // creating new tree when resultsNode or criteriaNodes is changed
  useEffect(() => {
    tree = ContextureMobx({
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
        { key: 'results', type: 'results', ...resultsNode },
        { key: 'criteria', type: 'group', children: _.castArray(criteriaNodes) },
      ],
    })
    setTree(tree)
  }, [resultsNode, criteriaNodes])

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

let MemoryTable = ({ data, debug, resultsNode, criteriaNodes, ...props }) => {
  let tree = useMemoryTree({
    records: data,
    debug,
    resultsNode,
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
