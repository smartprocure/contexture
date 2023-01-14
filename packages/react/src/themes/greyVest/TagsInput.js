import React from 'react'
import { defaultProps } from 'react-recompose'
import { Tag as DefaultTag, TagsInput } from '../../greyVest/index.js'

let RemoveIcon = (props) => (
  <span className="tags-input-tag-remove fa fa-times" {...props} />
)

export let Tag = defaultProps({ RemoveIcon })(DefaultTag)

export default defaultProps({ Tag })(TagsInput)
