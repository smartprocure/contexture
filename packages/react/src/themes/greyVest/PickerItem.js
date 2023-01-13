import React from 'react'
import { observer } from 'mobx-react'
import { Flex, Checkbox } from '../../greyVest/index.js'

let PickerItem = ({
  active,
  disabled,
  hasChildren,
  isChecked,
  onClick,
  children,
  ...props
}) => (
  <div
    style={{
      padding: '10px',
      cursor: 'pointer',
      fontSize: 18,
      background: active ? '#ebebeb' : '#fff',
      color: disabled ? '#9b9b9b' : '#000',
    }}
    onClick={onClick}
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
      <Flex>
        <Checkbox
          checked={isChecked}
          onChange={onClick}
          style={{ marginRight: 10 }}
        />
        {children}
      </Flex>
    )}
  </div>
)

export default observer(PickerItem)
