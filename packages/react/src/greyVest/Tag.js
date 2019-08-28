import React from 'react'
import F from 'futil-js'
import { observer } from 'mobx-react'
import Flex from './Flex'

/* GreyVest version - we only need one of these, really */
let RemoveTagIcon = props => (
  <span className="tags-input-tag-remove fa fa-times" {...props} />
)

let Tag = ({
  value,
  removeTag,
  RemoveIcon = RemoveTagIcon,
  tagStyle,
  onClick,
}) => (
  <span
    className="tags-input-tag"
    style={{
      cursor: 'pointer',
      margin: 3,
      borderRadius: '3px',
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
        {value}
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
