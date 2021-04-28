import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { Tag as DefaultTag, Flex } from '.'
import { sanitizeTagWords, splitTagOnComma, takeTags } from './utils'

export let Tags = ({
  reverse = false,
  tags,
  removeTag,
  tagStyle,
  onTagClick = _.noop,
  Tag = DefaultTag,
}) => (
  <Flex
    wrap
    alignItems="center"
    style={{
      cursor: 'text',
      margin: '0 -2px',
    }}
  >
    {_.flow(
      reverse ? _.reverse : _.identity,
      _.map(t => (
        <Tag
          key={t}
          value={t}
          {...{ removeTag, tagStyle }}
          onClick={() => onTagClick(t)}
        />
      ))
    )(tags)}
  </Flex>
)

let isValidInput = (tag, tags) => !_.isEmpty(tag) && !_.includes(tag, tags)

let ExpandableTagsInput = ({
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
  maxWordsPerTag = 100,
  maxCharsPerTagWord = 100,
  wordsMatchPattern,
  onTagClick = _.noop,
  onTagsDropped,
  maxTags = 1000,
  sanitizeTags = true,
  Tag = DefaultTag,
  ...props
}) => {
  let dropExtraTags = takeTags(maxTags, onTagsDropped)
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
    dropExtraTags,
    addTags
  )

  let [currentInput, setCurrentInput] = React.useState('')

  return (
    <div style={style}>
      <span className="tags-input-container" columns="1fr auto" gap="8px 4px">
        <input
          style={{ flex: 1, border: 0 }}
          onChange={e => {
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
          onKeyDown={e => {
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
          {...props}
        />
        <Tags reverse {...{ tags, removeTag, tagStyle, onTagClick, Tag }} />
      </span>
    </div>
  )
}

export default observer(ExpandableTagsInput)
