import React from 'react'
import F from 'futil'
import { observer } from 'mobx-react'
import Flex from './Flex.js'

let RemoveTagIcon = (props) => (
  <span className="tags-input-tag-remove" {...props}>
    x
  </span>
)

let Tag = ({
  value,
  label,
  removeTag,
  RemoveIcon = RemoveTagIcon,
  AddIcon = null,
  tagStyle,
  onClick,
  hoverColor,
}) => {
  let [hoverState, setHoverState] = React.useState(false)
  return (
    <span
      className="tags-input-tag"
      style={{
        display: 'inline-block',
        cursor: 'pointer',
        margin: '4px 3px',
        borderRadius: '3px',
        wordBreak: 'break-all',
        ...F.callOrReturn(tagStyle, value),
        ...(hoverState && hoverColor && { backgroundColor: hoverColor }),
      }}
      onClick={() => onClick({ value, label })}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
    >
      <Flex style={{ alignItems: 'center' }}>
        {AddIcon}
        <span
          style={{
            ...(!AddIcon && { paddingLeft: '0.45em' }),
            paddingBottom: '0.15em',
            // Prefer padding on the remove icon so it has more area to receive
            // clicks
            paddingRight: RemoveTagIcon ? '0em' : '0.45em',
          }}
        >
          {label || value}
        </span>
        <RemoveIcon
          onClick={(e) => {
            e.stopPropagation()
            removeTag(value)
          }}
        />
      </Flex>
    </span>
  )
}

export default observer(Tag)
