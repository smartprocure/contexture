import React, { forwardRef } from 'react'
import _ from 'lodash/fp.js'
import { observer } from 'mobx-react'
import Flex from './Flex.js'
import DefaultTag from './Tag.js'
import { createTags } from './utils.js'

let isValidInput = (tag, tags) => !_.isEmpty(tag) && !_.includes(tag, tags)

let TagsInput = forwardRef(
  (
    {
      tags,
      addTags: setTags,
      removeTag,
      submit = _.noop,
      tagStyle,
      placeholder = 'Search...',
      splitCommas,
      style,
      onBlur = _.noop,
      onInputChange = _.noop,
      onTagClick = _.noop,
      sanitizeTagFn,
      Tag = DefaultTag,
      ...props
    },
    inputRef
  ) => {
    let containerRef = React.useRef()
    let [currentInput, setCurrentInput] = React.useState('')

    let addTags = (input) => {
      let newTags = createTags({ input, splitCommas, sanitizeTagFn })
      setTags(_.difference(newTags, tags))
    }

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
            (t) => (
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
            onChange={(e) => {
              setCurrentInput(e.target.value)
              onInputChange()
            }}
            onBlur={() => {
              if (isValidInput(currentInput, tags)) {
                addTags(currentInput)
                setCurrentInput('')
                onBlur()
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !currentInput) submit()
              if (
                (_.includes(e.key, ['Enter', 'Tab']) ||
                  (splitCommas && e.key === ',')) &&
                isValidInput(currentInput, tags)
              ) {
                addTags(currentInput)
                setCurrentInput('')
                e.preventDefault()
              }
              if (e.key === 'Backspace' && !currentInput && tags.length) {
                let last = _.last(tags)
                removeTag(last)
                setCurrentInput(last)
                e.preventDefault()
              }
            }}
            value={currentInput}
            placeholder={placeholder}
            {..._.omit(['onTagsDropped', 'maxTags', 'Loader'], props)}
          />
        </Flex>
      </div>
    )
  }
)

export default observer(TagsInput)
