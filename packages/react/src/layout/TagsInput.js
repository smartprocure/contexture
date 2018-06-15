import React from 'react'
import _ from 'lodash/fp'
import {observable} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Flex} from './Flex'

let Tag = ({value, removeTag, join, tagStyle}) => (
  <div
    className='tags-input-tag'
    style={tagStyle}>
    {value}
    <span
      style={{
        paddingLeft: '10px',
        cursor: 'pointer',
      }}
      onClick={() => removeTag(value)}>
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
  observer(({tags, state, addTag, removeTag, tagStyle, TagComponent=Tag}) => (
    <label style={{display: 'block'}} className='tags-input'>
      <Flex
        style={{
          cursor: 'text',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
        {_.map(t => <TagComponent key={t} value={t} removeTag={removeTag} tagStyle={tagStyle} />, tags)}
        <input
          style={{border: 'none', outline:'none', width: 'auto'}}
          onChange={e => {
            state.currentInput = e.target.value
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
            if (e.key === 'Backspace' && !state.currentInput && tags.length) {
              removeTag(_.last(tags))
            }
          }}
          value={state.currentInput}
          placeholder='Search...'
        />
      </Flex>
    </label>
  ))
)
TagsInput.displayName = 'TagsInput'

export {
  Tag,
  TagsInput
}