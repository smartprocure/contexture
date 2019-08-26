import React from 'react'
import F from 'futil-js'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import ChipInput from 'material-ui-chip-input'
import { withTheme } from '../../utils/theme'
import { useLens } from '../../utils/react'

let TagsInput = _.flow(
  observer,
  withTheme
)(
  ({
    tags,
    addTag,
    removeTag,
    tagStyle,
    placeholder = 'Search...',
    PopoverContents,
    theme: { Popover, Tag },
    style,
    ...props
  }) => {
    let popover = useLens(false)
    let [selectedTag, setSelectedTag] = React.useState(null)
    let onTagClick = tag => {
      setSelectedTag(tag)
      F.on(popover)()
    }
    let chipRenderer = ({ value }) => (
      <Tag
        onClick={() => onTagClick(value)}
        removeTag={removeTag}
        value={value}
        style={{ marginRight: 4, ...tagStyle }}
      />
    )
    return (
      <>
        <ChipInput
          onAdd={addTag}
          onDelete={removeTag}
          placeholder={placeholder}
          value={tags}
          chipRenderer={chipRenderer}
          style={style}
          fullWidth
          alwaysShowPlaceholder
          {...props}
        />
        {PopoverContents && (
          <Popover isOpen={popover}>
            <PopoverContents tag={selectedTag} />
          </Popover>
        )}
      </>
    )
  }
)
export default TagsInput
