import React from 'react'
import F from 'futil-js'
import { Chip } from '@material-ui/core'

let Tag = ({ removeTag, value, tagStyle, ...props }) => (
  <Chip
    onDelete={() => removeTag(value)}
    label={value}
    style={F.callOrReturn(tagStyle, value)}
    {...props}
  />
)

export default Tag
