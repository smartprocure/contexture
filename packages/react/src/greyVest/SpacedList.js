import * as F from 'futil-js'
import React from 'react'

let SpacedList = ({ children, style = { marginBottom: '25px' } }) =>
  F.mapIndexed(
    (child, i) => (
      <div style={i !== children.length - 1 ? style : {}} key={i}>
        {child}
      </div>
    ),
    children
  )
SpacedList.displayName = 'SpacedList'

export default SpacedList
