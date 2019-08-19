import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { withState } from 'recompose'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import Flex from './Flex'
import OutsideClickHandler from 'react-outside-click-handler'
import { withTheme } from '../utils/theme'

let isValidInput = (tag, tags) => !_.isEmpty(tag) && !_.includes(tag, tags)

// We're only using withState to preserve the state between renders, since
// inject doesn't do that for us.
let TagsInput = withState('state', 'setState', () =>
  observable({
    currentInput: '',
    selectedTag: null,
    popoverOpen: false,
    isOneLine: true,
  })
)(
  _.flow(
    observer,
    withTheme
  )(
    ({
      tags,
      state,
      addTag,
      removeTag,
      submit = _.noop,
      tagStyle,
      placeholder = 'Search...',
      splitCommas,
      PopoverContents,
      theme: { Popover, Tag },
      style,
      ...props
    }) => {
      let containerRef
      let inputRef
      addTag = splitCommas
        ? _.flow(
            _.split(','),
            _.invokeMap('trim'),
            _.compact,
            _.uniq,
            _.difference(_, tags),
            _.map(addTag)
          )
        : _.flow(
            _.trim,
            addTag
          )
      return (
        <OutsideClickHandler
          onOutsideClick={() => {
            state.isOneLine = true
            containerRef.scrollTop = 0
          }}
        >
          <div
            className={`tags-input ${
              state.isOneLine ? 'tags-input-one-line' : ''
            }`}
            ref={e => (containerRef = e ? e : containerRef)}
            style={{ ...style }}
            onClick={() => {
              if (state.isOneLine) {
                state.isOneLine = false
                inputRef.focus()
              }
            }}
          >
            <Flex
              wrap
              alignItems="center"
              style={{
                cursor: 'text',
                height: '100%',
                padding: 2,
              }}
            >
              {_.map(
                t => (
                  <Tag
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
                  minWidth: 120,
                }}
                ref={e => (inputRef = e)}
                onChange={e => {
                  state.currentInput = e.target.value
                }}
                onBlur={() => {
                  if (isValidInput(state.currentInput, tags)) {
                    addTag(state.currentInput)
                    state.currentInput = ''
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !state.currentInput) submit()
                  if (
                    (_.includes(e.key, ['Enter', 'Tab']) ||
                      (splitCommas && e.key === ',')) &&
                    isValidInput(state.currentInput, tags)
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
                {...props}
              />
            </Flex>
            {PopoverContents && (
              <Popover isOpen={F.lensProp('popoverOpen', state)}>
                <PopoverContents tag={state.selectedTag} />
              </Popover>
            )}
          </div>
        </OutsideClickHandler>
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

export { TagsInput, MockTagsInput }
