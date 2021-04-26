import React, { forwardRef } from 'react'
import _ from 'lodash/fp'
import { observable } from 'mobx'
import { observer, inject, useLocalStore } from 'mobx-react'
import Flex from './Flex'
import DefaultTag from './Tag'

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
      wordsMatchPattern,
      sanitizeTags = true,
      Tag = DefaultTag,
      ...props
    },
    inputRef
  ) => {
    let containerRef = React.useRef()
    let state = useLocalStore(() => ({ currentInput: '' }))

    let words = _.words.convert({ fixed: false })
    // Convert string to words, take the first maxWordsPerTag, truncate them and convert back to string
    let sanitizeWords = _.flow(
      string => words(string, wordsMatchPattern),
      _.take(maxWordsPerTag),
      _.map(_.truncate({ length: maxCharsPerTagWord, omission: '' })),
      _.join(' ')
    )

    addTags = splitCommas
      ? _.flow(
          _.split(','),
          _.invokeMap('trim'),
          _.compact,
          _.uniq,
          tags => (sanitizeTags ? _.map(sanitizeWords, tags) : tags),
          _.difference(_, tags),
          addTags
        )
      : _.flow(_.trim, _.castArray, addTags)
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
