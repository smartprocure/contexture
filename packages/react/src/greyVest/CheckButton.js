import _ from 'lodash/fp'
import React from 'react'
import Flex from './Flex'
import { withTheme } from '../utils/theme'

let CheckButton = ({
  theme,
  checked = false,
  onClick,
  children,
  className,
  ...props
}) => (
  <theme.Button
    onClick={onClick}
    className={`checkbutton ${className || ''}`}
    {...props}
  >
    <Flex alignItems="center" justifyContent="center">
      <theme.Checkbox
        checked={!!checked} // prevent react "uncontrolled component" warning when `checked` prop is undefined
        onChange={_.noop} // prevent another react warning when `checked` is passed but `onChange` isn't
        disabled
      />
      {children}
    </Flex>
  </theme.Button>
)
export default withTheme(CheckButton)
