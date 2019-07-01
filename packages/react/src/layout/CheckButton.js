import React from 'react'
import { Flex } from './Flex'

let CheckboxDefault = (props) => <input type="checkbox" disabled {...props} />

let CheckButton = ({ Button = 'button', Checkbox = CheckboxDefault, checked = false, onClick, children, ...props }) => (
  <Button onClick={onClick} {...props}>
    <Flex alignItems="center" justifyContent="center">
      <Checkbox checked={checked} />
      {children}
    </Flex>
  </Button>
)
export default CheckButton
