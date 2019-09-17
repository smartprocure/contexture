import React from 'react'
import { observer } from 'mobx-react'
import ChipInput from 'material-ui-chip-input'
import MaterialTag from './Tag'

let TagsInput = ({
  tags,
  addTag,
  removeTag,
  onTagClick,
  tagStyle,
  placeholder = 'Search...',
  Tag = MaterialTag,
  style,
}) => (
  <ChipInput
    onAdd={addTag}
    onDelete={removeTag}
    placeholder={placeholder}
    value={tags}
    chipRenderer={({ value }) => (
      <Tag
        onClick={() => onTagClick(value)}
        removeTag={removeTag}
        value={value}
        style={{ marginRight: 4 }}
        tagStyle={tagStyle}
      />
    )}
    style={style}
    fullWidth
    alwaysShowPlaceholder
  />
)

export default observer(TagsInput)
