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
  storiesOf('Search Components (Unthemed)|QueryBuilder/Internals/Operator', module)
    .addDecorator(DnDDecorator)
    .addWithJSX('and', operatorStory('and', 1, root))
    .addWithJSX('or', operatorStory('or', 1, root))
    .addWithJSX('not', operatorStory('not', 1, root))
    .addWithJSX('first and', operatorStory('and', 0, root))
    .addWithJSX('first or', operatorStory('or', 0, root))
    .addWithJSX('first not', operatorStory('not', 0, root))
