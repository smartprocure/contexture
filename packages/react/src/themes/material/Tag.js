import React from 'react'
import F from 'futil-js'
import { Chip } from '@material-ui/core'

let Tag = ({ removeTag, value, tagStyle, style, ...props }) => (
  <Chip
    onDelete={() => removeTag(value)}
    label={value}
    style={{ margin: '3px 2px', ...F.callOrReturn(tagStyle, value), ...style }}
    {...props}
  />
)

export default Tag
