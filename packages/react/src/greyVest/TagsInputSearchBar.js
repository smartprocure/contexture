import React from 'react'
import _ from 'lodash/fp'
import { observable } from 'mobx'
import { observer, inject, useLocalStore } from 'mobx-react'
import { Flex, Tag as DefaultTag } from '.'
import OutsideClickHandler from 'react-outside-click-handler'

let isValidInput = (tag, tags) => !_.isEmpty(tag) && !_.includes(tag, tags)

// We're only using withState to preserve the state between renders, since
// inject doesn't do that for us.
let TagsInputSearchBar = ({
  tags,
  addTag,
  removeTag,
  submit = _.noop,
  tagStyle,
  placeholder = 'Search...',
  splitCommas,
  style,
  onBlur = _.noop,
  onInputChange = _.noop,
  onTagClick = _.noop,
  Tag = DefaultTag,
  ...props
}) => {
  let containerRef
  let inputRef
  let state = useLocalStore(() => ({ currentInput: '', isOneLine: true }))
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
        className={`tags-input ${state.isOneLine ? 'tags-input-one-line' : ''}`}
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
                onClick={() => onTagClick(t)}
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
              onInputChange()
            }}
            onBlur={() => {
              if (isValidInput(state.currentInput, tags)) {
                addTag(state.currentInput)
                state.currentInput = ''
                onBlur()
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
              if (e.key === 'Backspace' && !state.currentInput && tags.length) {
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
      </div>
    </OutsideClickHandler>
  )
}

// Just uses an internal observable array
export let MockTagsInputSearchBar = inject(() => {
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
})(TagsInputSearchBar)
MockTagsInputSearchBar.displayName = 'MockTagsInputSearchBar'

export default observer(TagsInputSearchBar)
