import React from 'react'
import { Observer } from 'mobx-react'

let Input =  ({ className = '', style, type = 'text', ...x }, ref) => (
  <Observer>
    {() => (
      <input
        className={`${className} gv-input`}
        style={{
          ...style,
        }}
        type={type}
        ref={ref}
        {...x}
      />
    )}
  </Observer>
)
export default React.forwardRef(Input)