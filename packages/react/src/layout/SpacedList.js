import React from 'react'

let SpacedList = ({ children, style = { marginBottom: '25px' } }) =>
  children.map((child, i) => (
    <div style={i !== children.length - 1 ? style : {}} key={i}>
      {child}
    </div>
  ))
SpacedList.displayName = 'SpacedList'

export default SpacedList