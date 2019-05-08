import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { withState } from 'recompose'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Flex } from './Flex'
import Popover from './Popover'

let Tag = observer(({ value, removeTag, tagStyle, removeIcon, onClick }) => (
  <Flex
    className="tags-input-tag"
    style={{
      ...F.callOrReturn(tagStyle, value),
      alignItems: 'center',
      cursor: 'pointer',
      margin: 3,
      borderRadius: '2px',
    }}
    onClick={onClick}
  >
    <span style={{ padding: '0px 5px 1px 10px' }}>{value}</span>
    <span
      onClick={e => {
        e.stopPropagation()
        removeTag(value)
      }}
      style={{ padding: '0px 10px 1px 5px' }}
    >
      {removeIcon || <span className="tags-input-tag-remove">x</span>}
    </span>
  </Flex>
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
        <div className="tags-input" style={{ height: '100%' }}>
          <Flex
            style={{
              cursor: 'text',
              alignItems: 'center',
              flexWrap: 'wrap',
              height: '100%',
              padding: 3,
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
              style={{
                border: 'none',
                outline: 'none',
                flex: 1,
                margin: 3,
              }}
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
