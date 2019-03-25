import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { withState } from 'recompose'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Flex } from './Flex'
import Popover from './Popover'

let Tag = observer(({ value, removeTag, tagStyle, onClick }) => (
  <div
    className="tags-input-tag"
    style={F.callOrReturn(tagStyle, value)}
    onClick={onClick}
  >
    {value}
    <span
      className="tags-input-tag-remove"
      style={{
        paddingLeft: '10px',
        cursor: 'pointer',
      }}
      onClick={() => removeTag(value)}
    >
      x
    </span>
  </div>
))
Tag.displayName = 'Tag'

// We're only using withState to preserve the state between renders, since
// inject doesn't do that for us.
let TagsInput = withState('state', 'setState', () =>
  observable({
    currentInput: '',
    selectedTag: null,
    popoverOpen: false,
  })
)(
  observer(
    ({
      tags,
      state,
      addTag,
      removeTag,
      submit = _.noop,
      tagStyle,
      TagComponent = Tag,
      placeholder = 'Search...',
      splitCommas,
      PopoverContents,
    }) => {
      if (splitCommas)
        addTag = _.flow(
          _.split(','),
          _.map(addTag)
        )
      return (
        <div>
          <label style={{ display: 'block' }} className="tags-input">
            <Flex
              style={{
                cursor: 'text',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {_.map(
                t => (
                  <TagComponent
                    key={t}
                    value={t}
                    {...{ removeTag, tagStyle }}
                    onClick={() => {
                      state.popoverOpen = true
                      state.selectedTag = t
                    }}
                  />
                ),
                tags
              )}
              <input
                style={{ border: 'none', outline: 'none', width: 'auto' }}
                onChange={e => {
                  state.currentInput = e.target.value
                }}
                onBlur={() => {
                  if (
                    state.currentInput &&
                    !_.includes(state.currentInput, tags)
                  ) {
                    addTag(state.currentInput)
                    state.currentInput = ''
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !state.currentInput) submit()
                  if (
                    (e.key === 'Enter' ||
                      e.key === 'Tab' ||
                      (splitCommas && e.key === ',')) &&
                    state.currentInput &&
                    !_.includes(state.currentInput, tags)
                  ) {
                    addTag(state.currentInput)
                    state.currentInput = ''
                    e.preventDefault()
                  }
                  if (
                    e.key === 'Backspace' &&
                    !state.currentInput &&
                    tags.length
                  ) {
                    let last = _.last(tags)
                    removeTag(last)
                    state.currentInput = last
                    e.preventDefault()
                  }
                }}
                value={state.currentInput}
                placeholder={placeholder}
              />
            </Flex>
          </label>
          {PopoverContents && (
            <Popover isOpen={F.lensProp('popoverOpen', state)}>
              <PopoverContents tag={state.selectedTag} />
            </Popover>
          )}
        </div>
      )
    }
  )
)
TagsInput.displayName = 'TagsInput'

// Just uses an internal observable array
let MockTagsInput = inject(() => {
  let tags = observable([])
  return {
    tags,
    addTag(tag) {
      tags.push(tag)
    },
    removeTag(tag) {
      tags = _.without(tag, tags)
    },
  }
})(TagsInput)
MockTagsInput.displayName = 'MockTagsInput'

export { Tag, TagsInput, MockTagsInput }
