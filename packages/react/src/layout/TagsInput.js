import React from 'react'
import _ from 'lodash/fp'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Flex } from './Flex'

let Tag = ({ value, removeTag, tagStyle }) => (
  <div className="tags-input-tag" style={tagStyle}>
    {value}
    <span
      className="tags-input-tag-remove"
      style={{
        paddingLeft: '10px',
        cursor: 'pointer',
      }}
      onClick={() => removeTag(value)}
    >
      x
    </span>
  </div>
)
Tag.displayName = 'Tag'

let TagsInput = inject(() => ({
  state: observable({
    currentInput: '',
  }),
}))(
  observer(
    ({ tags, state, addTag, removeTag, tagStyle, TagComponent = Tag }) => (
      <div>
        <label style={{ display: 'block' }} className="tags-input">
          <Flex
            style={{
              cursor: 'text',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {_.map(
              t => (
                <TagComponent key={t} value={t} {...{ removeTag, tagStyle }} />
              ),
              tags
            )}
            <input
              style={{ border: 'none', outline: 'none', width: 'auto' }}
              onChange={e => {
                state.currentInput = e.target.value
              }}
              onBlur={e => {
                if (!_.includes(state.currentInput, tags)) {
                  addTag(state.currentInput)
                  state.currentInput = ''
                }
              }}
              onKeyDown={e => {
                if (
                  (e.key === 'Enter' || e.key === 'Tab') &&
                  !_.includes(state.currentInput, tags)
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
                  removeTag(_.last(tags))
                }
              }}
              value={state.currentInput}
              placeholder="Search..."
            />
          </Flex>
        </label>
      </div>
    )
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
