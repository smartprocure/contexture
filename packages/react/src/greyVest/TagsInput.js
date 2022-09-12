import React, { forwardRef } from 'react'
import _ from 'lodash/fp'
import { observable } from '../utils/mobx'
import { observer, inject, useLocalObservable } from 'mobx-react'
import Flex from './Flex'
import DefaultTag from './Tag'
import { sanitizeTagWords, splitTagOnComma, alphaNumericRegEx } from './utils'

let isValidInput = (tag, tags) => !_.isEmpty(tag) && !_.includes(tag, tags)

let TagsInput = forwardRef(
  (
    {
      tags,
      addTags,
      removeTag,
      submit = _.noop,
      tagStyle,
      placeholder = 'Search...',
      splitCommas,
      style,
      onBlur = _.noop,
      onInputChange = _.noop,
      onTagClick = _.noop,
      maxWordsPerTag = 100,
      maxCharsPerTagWord = 100,
      wordsMatchPattern = alphaNumericRegEx,
      sanitizeTags = true,
      Tag = DefaultTag,
      ...props
    },
    inputRef
  ) => {
    let containerRef = React.useRef()
    let state = useLocalObservable(() => ({ currentInput: '' }))
    let sanitizeTagFn = sanitizeTagWords(
      wordsMatchPattern,
      maxWordsPerTag,
      maxCharsPerTagWord
    )

    addTags = _.flow(
      _.trim,
      tags => (splitCommas ? splitTagOnComma(tags) : _.castArray(tags)),
      tags => (sanitizeTags ? _.map(sanitizeTagFn, tags) : tags),
      _.difference(_, tags),
      addTags
    )

    return (
      <div className={'tags-input'} ref={containerRef} style={{ ...style }}>
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
            ref={inputRef}
            onChange={e => {
              state.currentInput = e.target.value
              onInputChange()
            }}
            onBlur={() => {
              if (isValidInput(state.currentInput, tags)) {
                addTags(state.currentInput)
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
                addTags(state.currentInput)
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
    )
  }
)

// Just uses an internal observable array
export let MockTagsInput = inject(() => {
  let tags = observable([])
  return {
    tags,
    addTags(tag) {
      tags.push(tag)
    },
    removeTag(tag) {
      tags = _.without(tag, tags)
    },
  }
})(TagsInput)
MockTagsInput.displayName = 'MockTagsInput'

export default observer(TagsInput)
