import React from 'react'
import { defaultProps } from 'recompose'
import Tag from '../../greyVest/Tag'

let RemoveIcon = props => (
  <span className="tags-input-tag-remove fa fa-times" {...props} />
)

export default defaultProps({ RemoveIcon })(Tag)
