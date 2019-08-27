import React from 'react'
import { observer } from 'mobx-react'
import ChipInput from 'material-ui-chip-input'

let SimpleTagsInput = ({
  tags,
  addTag,
  removeTag,
  placeholder = 'Search...',
  style,
  ...props
}) => (
  <ChipInput
    onAdd={addTag}
    onDelete={removeTag}
    placeholder={placeholder}
    value={tags}
    style={style}
    fullWidth
    alwaysShowPlaceholder
    {...props}
  />
)

export default observer(SimpleTagsInput)
