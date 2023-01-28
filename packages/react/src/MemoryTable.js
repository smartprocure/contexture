import _ from 'lodash/fp.js'
import Contexture from 'contexture'
import memory from 'contexture/provider-memory/index.js'
import types from 'contexture/provider-memory/exampleTypes.js'
import React, { useState } from 'react'
import ContextureMobx from './utils/contexture-mobx.js'
import { componentForType } from './utils/schema.js'
import { ResultTable, TypeMap } from './exampleTypes/index.js'

export let useMemoryTree = ({
  records,
  debug,
  resultsNode,
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
        {
          key: 'results',
          type: 'results',
          pageSize: 50,
          ...resultsNode,
        },
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
    tree = makeTree()
    setTree(tree)
  }

  let setRecords = (records) => {
    if (records !== memoryStorage.records) {
      memoryStorage.records = records
      tree.refresh(['root'])
    }
  }

  if (records.then) Promise.resolve(records).then(setRecords)
  else setRecords(records)

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
