import React from 'react'
import _ from 'lodash/fp.js'
import { Flex } from '../../greyVest/index.js'
import { withTheme } from '../../utils/theme.js'

let ButtonRadio = ({
  value,
  onChange = () => {},
  options,
  style = {},
  theme: { Button },
}) => (
  <Flex style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
    {_.map(
      (x) => (
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
