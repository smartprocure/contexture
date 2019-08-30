import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { withTheme } from '../utils/theme'
import { useLens } from '../utils/react'

// We're only using withState to preserve the state between renders, since
// inject doesn't do that for us.
let PopoverTagsInput = ({
  PopoverContents,
  onTagClick,
  theme: { Popover, TagsInput },
  ...props
}) => {
  let isOpen = useLens(false)
  let [selectedTag, setSelectedTag] = React.useState(null)
  return (
    <>
      <TagsInput
        onTagClick={tag => {
          F.on(isOpen)()
          setSelectedTag(tag)
          onTagClick(tag)
        }}
        {...props}
      />
      {PopoverContents && (
        <Popover isOpen={isOpen}>
          <PopoverContents tag={selectedTag} />
        </Popover>
      )}
    </>
  )
}

export default _.flow(
  observer,
  withTheme
)(PopoverTagsInput)
