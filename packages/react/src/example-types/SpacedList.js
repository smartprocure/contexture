import React from 'react'

export default ({children, style = {marginBottom: '25px'}}) =>
  children.map((child, i) => (
    <div style={i !== children.length - 1 ? style : {}} key={i}>
      {child}
    </div>
  ))
