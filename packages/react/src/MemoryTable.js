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

/**
A ResultTable from arbitrary data using contexture's memory provider MemoryTable
is built on top of ResultTable and supports several of the same props: most
notably `fields`, which takes a schema object that specifies which fields from
the data are visible in the table and how they are ordered, and `infer`, which
enables MemoryTable to infer field information from the given data without
having to explicitly specify it in `fields`.

However, in place of ResultTable's contexture-relevant `tree`, `node`, and
`path` props, MemoryTable simply accepts a `data` prop, which should be an array
of obects. This is fed into a contexture instance running on the `memory`
provider, which allows contexture to work against data in the form of plain
Javascript objects (in contrast to, for example, a MongoDB database). The result
is a dynamically-generated table with built-in support for sorting and filtering
operations on the given data.
*/
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
