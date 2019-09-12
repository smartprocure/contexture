import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import Flex from './Flex'
import DefaultTag from './Tag'
import { useLensObject } from '../utils/react'
import OutsideClickHandler from 'react-outside-click-handler'

let isValidInput = (tag, tags) => !_.isEmpty(tag) && !_.includes(tag, tags)

// We're only using withState to preserve the state between renders, since
// inject doesn't do that for us.
let TagsInput = ({
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
  let state = useLensObject({ currentInput: '', isOneLine: true })
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
        F.on(state.isOneLine)()
        containerRef.scrollTop = 0
      }}
    >
      <div
        className={`tags-input ${state.isOneLine ? 'tags-input-one-line' : ''}`}
        ref={e => (containerRef = e ? e : containerRef)}
        style={{ ...style }}
        onClick={() => {
          if (F.view(state.isOneLine)) {
            F.off(state.isOneLine)()
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
              F.set(e.target.value, state.currentInput)
              onInputChange()
            }}
            onBlur={() => {
              if (isValidInput(F.view(state.currentInput), tags)) {
                addTag(F.view(state.currentInput))
                F.set('', state.currentInput)
                onBlur()
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !F.view(state.currentInput)) submit()
              if (
                (_.includes(e.key, ['Enter', 'Tab']) ||
                  (splitCommas && e.key === ',')) &&
                isValidInput(F.view(state.currentInput), tags)
              ) {
                addTag(F.view(state.currentInput))
                F.set('', state.currentInput)
                e.preventDefault()
              }
              if (
                e.key === 'Backspace' &&
                !F.view(state.currentInput) &&
                tags.length
              ) {
                let last = _.last(tags)
                removeTag(last)
                F.set(last, state.currentInput)
                e.preventDefault()
              }
            }}
            value={F.view(state.currentInput)}
            placeholder={placeholder}
            {...props}
          />
        </Flex>
      </div>
    </OutsideClickHandler>
  )
}
TagsInput.displayName = 'TagsInput'

// Just uses an internal observable array
export let MockTagsInput = inject(() => {
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

export default observer(TagsInput)
