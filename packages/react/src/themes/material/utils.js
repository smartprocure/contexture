import React from 'react'
import F from 'futil-js'

export let lensify = Component =>
  React.forwardRef(({ isOpen, ...props }, ref) => (
    <Component
      open={F.view(isOpen)}
      onClose={F.off(isOpen)}
      {...props}
      ref={ref}
    />
  ))
