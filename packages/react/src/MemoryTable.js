import _ from 'lodash/fp'
import Contexture from 'contexture'
import memory from 'contexture/src/provider-memory'
import types from 'contexture/src/provider-memory/exampleTypes'
import React, { useState } from 'react'
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
  let makeTree = () =>
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
        { key: 'results', type: 'results', ...resultsNode },
        {
          key: 'criteria',
          type: 'group',
          children: _.castArray(criteriaNodes),
        },
      ],
    })

  let [memoryStorage] = useState({ records: [] })
  let [dependency, setDependency] = useState([resultsNode, criteriaNodes])
  let [tree, setTree] = useState(makeTree)

  // creating new tree when resultsNode or criteriaNodes is changed
  // useEffect is not working due to shallow equality check
  if (!_.isEqual(dependency, [resultsNode, criteriaNodes])) {
    setDependency([resultsNode, criteriaNodes])
    setTree(makeTree())
  }

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
