import React from 'react'
import Component from './Flex.js'

export default {
  component: Component,
  args: {
    wrap: true,
    justifyContent: 'center',
    style: {
      backgroundColor: 'lightblue',
      fontSize: '2em',
      maxWidth: 300,
    },
    children: (
      <>
        <div>Item1</div>
        <div>Item2</div>
        <div>Item2</div>
        <div>Item4</div>
        <div>Item5</div>
        <div>Item6</div>
      </>
    ),
  },
}

export const AsButton = { as: 'button' }

export const NoChildren = {}
