import React from 'react'
import _ from 'lodash/fp'
import Flex from '../../layout/Flex'
import DefaultButton from './Button'
import { withTheme } from '../../utils/theme'

let ButtonRadio = ({
  value,
  onChange = () => {},
  options,
  style = {},
  theme: { Button = DefaultButton },
}) => (
  <Flex style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
    {_.map(
      x => (
        <Button
          key={x.value}
          isActive={x.value === value}
          onClick={() => onChange(x.value)}
          style={style}
        >
          {x.label}
        </Button>
      ),
      options
    )}
  </Flex>
)

export default withTheme(ButtonRadio)
