import React from 'react'
import { observer } from 'mobx-react'

let FilterListItem = ({
  active,
  disabled,
  hasChildren,
  children,
  ...props
}) => (
  <div
    style={{
      padding: '10px 40px',
      cursor: 'pointer',
      fontSize: 18,
      background: active ? '#ebebeb' : '#fff',
      color: disabled ? '#9b9b9b' : '#000',
    }}
    {...props}
  >
    {hasChildren ? (
      <Flex style={{ alignItems: 'center' }}>
        {children}
        <i className="material-icons" style={{ fontSize: 20 }}>
          chevron_right
        </i>
      </Flex>
    ) : (
      children
    )}
  </div>
)

export default observer(FilterListItem)
