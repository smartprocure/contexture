import React from 'react'
import { defaultProps } from 'recompose'
import { Tag as DefaultTag, TagsInput } from '../../greyVest'

let RemoveIcon = props => (
  <span className="tags-input-tag-remove fa fa-times" {...props} />
)

export let Tag = defaultProps({ RemoveIcon })(DefaultTag)

export default defaultProps({ Tag })(TagsInput)
