import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { Tag as DefaultTag, Flex } from '.'

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
              addTag(currentInput)
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
              addTag(currentInput)
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
