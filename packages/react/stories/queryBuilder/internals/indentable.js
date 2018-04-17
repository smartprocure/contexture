import React from 'react'
import { storiesOf } from '@storybook/react'
import Indentable from '../../../src/queryBuilder/preview/Indentable'

export default () =>
  storiesOf('QueryBuilder/Internals/Indentable', module)
    .add('and', () => (
      <Indentable indent={() => true} tree={{ join: 'and' }}>
        <div style={{ height: '100px' }}>Contents</div>
      </Indentable>
    ))
    .add('or', () => (
      <Indentable indent={() => true} tree={{ join: 'or' }}>
        <div style={{ height: '100px' }}>Contents</div>
      </Indentable>
    ))
    .add('not', () => (
      <Indentable indent={() => true} tree={{ join: 'not' }}>
        <div style={{ height: '100px' }}>Contents</div>
      </Indentable>
    ))
