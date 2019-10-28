import React from 'react'
import _ from 'lodash/fp'
import { observer, useLocalStore } from 'mobx-react'
import { Tag as DefaultTag } from '.'
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
  children,
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
        ref={e => {
          if (e) {
            containerRef = e
          }
        }}
        style={{ ...style }}
      >
        <span
          className="tags-input-container"
          onClick={() => {
            state.isInputVisible = true
            state.isOneLine = false
            inputRef && inputRef.focus()
          }}
        >
          {(state.isInputVisible || !tags.length) && (
            <input
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
                  state.isInputVisible = true
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
          )}
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
        </span>
        {children}
      </div>
      {!!(state.isOneLine && tags.length) && (
        <div
          className="down-arrow-shape-container"
          onClick={() => {
            if (state.isOneLine) {
              state.isOneLine = false
              state.isInputVisible = true
            }
          }}
        >
          <div className="down-arrow-shape" title="Expand to see all keywords">
            <i
              className="material-icons"
              style={{ zIndex: 10, position: 'relative' }}
            >
              keyboard_arrow_down
            </i>
          </div>
        </div>
      )}
    </OutsideClickHandler>
  )
}

export default observer(TagsInputSearchBar)
