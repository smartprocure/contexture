import React from 'react'
import F from 'futil'
import { observer } from 'mobx-react'
import Flex from './Flex'

let RemoveTagIcon = props => (
  <span className="tags-input-tag-remove" {...props}>
    x
  </span>
)

let Tag = ({
  value,
  label,
  removeTag,
  RemoveIcon = RemoveTagIcon,
  tagStyle,
  onClick
}) => (
  <span
    className="tags-input-tag"
    style={{
      display: 'inline-block',
      cursor: 'pointer',
      margin: 3,
      borderRadius: '3px',
      wordBreak: 'break-all',
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
          paddingRight: RemoveTagIcon ? '0em' : '0.45em',
        }}
      >
        {label || value}
      </span>
      <RemoveIcon
        onClick={e => {
          e.stopPropagation()
          removeTag(value)
        }}
      />
    </Flex>
  </span>
)

export default observer(Tag)
