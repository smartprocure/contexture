import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { withState } from 'recompose'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { withTheme } from '../utils/theme'

// We're only using withState to preserve the state between renders, since
// inject doesn't do that for us.
let PopoverTagsInput = ({
  PopoverContents,
  theme: { Popover, TagsInput },
  onTagClick,
  state,
  ...props
}) => (
  <>
    <TagsInput
      onTagClick={tag => {
        state.popoverOpen = true
        state.selectedTag = tag
        onTagClick(tag)
      }}
      {...props}
    />
    {PopoverContents && (
      <Popover isOpen={F.lensProp('popoverOpen', state)}>
        <PopoverContents tag={state.selectedTag} />
      </Popover>
    )}
  </>
)

export default _.flow(
  observer,
  withTheme,
  withState('state', 'setState', () =>
    observable({
      selectedTag: null,
      popoverOpen: false,
    })
  )
)(PopoverTagsInput)
