import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { withState, defaultProps } from 'recompose'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Flex } from './Flex'
import Popover from './Popover'

let isValidTag = (tag, tags) => {
  let cleanTag = _.toLower(_.trim(tag))
  return !_.isEmpty(cleanTag) && !_.some(t => _.toLower(t) === cleanTag, tags)
}

let Tag = observer(({ value, removeTag, tagStyle, RemoveIcon, onClick }) => (
  <span
    className="tags-input-tag"
    style={{
      cursor: 'pointer',
      margin: 3,
      borderRadius: '3px',
      ...F.callOrReturn(tagStyle, value),
    }}
    onClick={onClick}
  >
    <Flex style={{ alignItems: 'center' }}>
      <span
        style={{
          paddingLeft: '0.45em',
          paddingBottom: '0.15em',
          // Prefer padding on the remove icon so it has more area to receive
          // clicks
          paddingRight: RemoveIcon ? '0em' : '0.45em',
        }}
      >
        {value}
      </span>
      {RemoveIcon && (
        <RemoveIcon
          onClick={e => {
            e.stopPropagation()
            removeTag(value)
          }}
        />
      )}
    </Flex>
  </span>
))
Tag.displayName = 'Tag'

let DefaultTagComponent = defaultProps({
  RemoveIcon: props => (
    <span className="tags-input-tag-remove" {...props}>
      x
    </span>
  ),
})(Tag)

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
      TagComponent = DefaultTagComponent,
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
                if (isValidTag(state.currentInput, tags)) {
                  addTag(state.currentInput)
                  state.currentInput = ''
                }
              }}
              onKeyDown={e => {
                let currentInput = _.trim(state.currentInput)
                if (e.key === 'Enter' && !currentInput) submit()
                if ((e.key === 'Enter' || e.key === 'Tab' || (splitCommas && e.key === ',')) && isValidTag(currentInput, tags)) {
                  addTag(currentInput)
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
