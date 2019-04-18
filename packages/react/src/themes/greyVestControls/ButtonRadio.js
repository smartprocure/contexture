import React from 'react'
import Button from './Button'
import {Flex} from '../../'

export let ButtonRadio = ({
  value,
  onChange = () => {},
  options,
  style = {},
}) => (
  <Flex className="gv-button-radio" style={{ alignItems: 'baseline' }}>
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