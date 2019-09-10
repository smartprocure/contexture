import React from 'react'
import { storiesOf } from '@storybook/react'
import Indentable from './Indentable'

storiesOf(
  'Components|Search Components/QueryBuilder/Internals/Indentable',
  module
)
  .addWithJSX('and', () => (
    <Indentable indent={() => true} node={{ join: 'and' }}>
      <div style={{ height: '100px' }}>Contents</div>
    </Indentable>
  ))
  .addWithJSX('or', () => (
    <Indentable indent={() => true} node={{ join: 'or' }}>
      <div style={{ height: '100px' }}>Contents</div>
    </Indentable>
  ))
  .addWithJSX('not', () => (
    <Indentable indent={() => true} node={{ join: 'not' }}>
      <div style={{ height: '100px' }}>Contents</div>
    </Indentable>
  ))
