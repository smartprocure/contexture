import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { withState, defaultProps } from 'recompose'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Flex } from './Flex'
import Popover from './Popover'
import OutsideClickHandler from 'react-outside-click-handler'

let isValidInput = (tag, tags) => !_.isEmpty(tag) && !_.includes(tag, tags)

// extracts only the unique (and not already used tags) from the user tags input
// e.g. if "x,y,z" are already entered then only "d" would be added if the user tris to enter "x,y,d"
// returns a string with either single tag or multiple unique tags separated by comma
let getUniqueTagsStringFromInput = (tag, tags, useCommaSeparator = true) => {
  let trimmedTag = _.trim(tag)
  if (useCommaSeparator && _.includes(',', trimmedTag)) {
    // Extract only the unique (and not present in the current tags collection) tags from the string
    let newUniqTags = _.difference(
      _.uniq(_.compact(_.split(',', trimmedTag))),
      tags
    )
    // if not empty return the joined string which would be split to separate tags in `addTag` if splitCommas is set
    return _.isEmpty(newUniqTags) ? null : newUniqTags.join(',')
  }
  return trimmedTag
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
    isOneLine: true,
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
      style,
      ...props
    }) => {
      let containerRef
      let inputRef
      if (splitCommas)
        addTag = _.flow(
          _.split(','),
          _.map(addTag)
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
                  minWidth: 120,
                }}
                ref={e => (inputRef = e)}
                onChange={e => {
                  state.currentInput = e.target.value
                }}
                onBlur={() => {
                  let input = getUniqueTagsStringFromInput(
                    state.currentInput,
                    tags,
                    splitCommas
                  )
                  if (isValidInput(input, tags)) {
                    addTag(input)
                    state.currentInput = ''
                  }
                }}
                onKeyDown={e => {
                  let input = getUniqueTagsStringFromInput(
                    state.currentInput,
                    tags,
                    splitCommas
                  )
                  if (e.key === 'Enter' && !input) submit()
                  if (
                    (_.includes(e.key, ['Enter', 'Tab']) ||
                      (splitCommas && e.key === ',')) &&
                    isValidInput(input, tags)
                  ) {
                    addTag(input)
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

export { Tag, TagsInput, MockTagsInput }
