import _ from 'lodash/fp'
import React from 'react'
import Flex from './Flex'

let CheckboxDefault = props => <input type="checkbox" {...props} />

let CheckButton = ({
  Button = 'button',
  Checkbox = CheckboxDefault,
  checked = false,
  onClick,
  children,
  ...props
}) => (
  <Button onClick={onClick} {...props}>
    <Flex alignItems="center" justifyContent="center">
      <Checkbox
        checked={!!checked} // prevent react "uncontrolled component" warning when `checked` prop is undefined
        onChange={_.noop} // prevent another react warning when `checked` is passed but `onChange` isn't
        disabled
      />
      {children}
    </Flex>
  </Button>
)
export default CheckButton
