import React from 'react'
import { storiesOf } from '@storybook/react'
import Operator from '../../../src/queryBuilder/Operator'

let operatorStory = (join, index) => () => (
  <Operator
    {...{
      tree: { join },
      child: {
        join: 'and',
      },
      root,
      index,
      parent,
      noDrop: true,
    }}
  />
)
export default (parent, root, DnDDecorator) =>
  storiesOf('QueryBuilder/Internals/Operator', module)
    .addDecorator(DnDDecorator)
    .add('and', operatorStory('and', 1))
    .add('or', operatorStory('or', 1))
    .add('not', operatorStory('not', 1))
    .add('first and', operatorStory('and', 0))
    .add('first or', operatorStory('or', 0))
    .add('first not', operatorStory('not', 0))
