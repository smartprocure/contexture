import F from 'futil'
import React from 'react'
import TestTree from './stories/testTree.js'
import Component from './CheckableResultTable.js'

export default {
  component: Component,
}

export const WithSelectedProp = () => {
  let selected = React.useState([])
  return (
    <div>
      Selected: {JSON.stringify(F.view(selected))}
      <Component
        tree={TestTree()}
        path={['results']}
        selected={selected}
        getValue="_id"
        fields={{
          _id: true,
          title: true,
          nested: { label: 'Nested Value', display: (x) => x.value },
        }}
      />
    </div>
  )
}

export const WithSelectedValuesOnChangeProps = () => {
  let [selectedValues, onChange] = React.useState([])
  return (
    <div>
      Selected: {JSON.stringify(selectedValues)}
      <Component
        tree={TestTree()}
        path={['results']}
        {...{ selectedValues, onChange }}
        getValue="_id"
        fields={{
          _id: true,
          title: true,
          nested: { label: 'Nested Value', display: (x) => x.value },
        }}
      />
    </div>
  )
}
