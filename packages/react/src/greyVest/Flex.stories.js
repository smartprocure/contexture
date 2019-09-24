import React from 'react'
import { storiesOf } from '@storybook/react'
import { Flex } from '.'

let FlexDemo = ({ style, ...props }) => (
  <Flex
    wrap
    justifyContent="center"
    style={{
      backgroundColor: 'lightblue',
      fontSize: '2em',
      maxWidth: 300,
      ...style,
    }}
    {...props}
  >
    <div>Item1</div>
    <div>Item2</div>
    <div>Item2</div>
    <div>Item4</div>
    <div>Item5</div>
    <div>Item6</div>
  </Flex>
)

storiesOf('GreyVest Library|Flex', module)
  .add('As button', () => (
    <Flex column alignItems="center">
      <FlexDemo as="button" />
    </Flex>
  ))
  .add('No children', () => (
    <Flex column alignItems="center">
      <Flex />
    </Flex>
  ))
