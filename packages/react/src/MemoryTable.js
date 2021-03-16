import _ from 'lodash/fp'
import Contexture from 'contexture'
import memory from 'contexture/src/provider-memory'
import types from 'contexture/src/provider-memory/exampleTypes'
import { observer } from 'mobx-react'
import React from 'react'
import ContextureMobx from './utils/contexture-mobx'
import { componentForType } from './utils/schema'
import { ResultTable, TypeMap } from './exampleTypes'

export let useMemoryTree = ({
  records = [],
  schema = 'data',
  fields,
  debug,
  resultNode = {
    pageSize: 50,
  },
  criteriaNodes = [],
  childrenNodes = [],
} = {}) => {
  let include = _.map('field', fields)
  let [storage] = React.useState({records})
  let [tree] = React.useState(
    ContextureMobx({
      disableAutoUpdate: true,
      service: Contexture({
        debug,
        schemas: { [schema]: { memory: storage } },
        providers: { memory: { ...memory, types: types() } },
      })
    })({
      key: 'root',
      schema: 'data',
      children: [
        { key: 'results', type: 'results', include, ...resultNode },
        { key: 'criteria', type: 'group', children: criteriaNodes },
        ...childrenNodes,
      ],
    })
  )

  let updateMemory = async records => {
    storage.records = await records
    tree.refresh(['root'])
  }

  return [tree, updateMemory]
}

let MemoryTable = ({ data, fields, debug, resultNode, criteriaNodes, childrenNodes, ...props }) => {
  let [tree, updateMemory] = useMemoryTree({
    fields,
    debug,
    resultNode,
    criteriaNodes,
    childrenNodes,
  })

  updateMemory(data)

  return (
    <ResultTable
      path={['root', 'results']}
      criteria={['root', 'criteria']}
      mapNodeToProps={componentForType(TypeMap)}
      {...{ fields, tree, ...props }}
    />
  )
}

export default observer(MemoryTable)
