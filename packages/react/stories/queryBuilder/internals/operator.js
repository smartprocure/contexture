import React from 'react'
import { storiesOf } from '@storybook/react'
import Operator from '../../../src/queryBuilder/Operator'

let operatorStory = (join, index, root) => () => (
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
    .add('and', operatorStory('and', 1, root))
    .add('or', operatorStory('or', 1, root))
    .add('not', operatorStory('not', 1, root))
    .add('first and', operatorStory('and', 0, root))
    .add('first or', operatorStory('or', 0, root))
    .add('first not', operatorStory('not', 0, root))
