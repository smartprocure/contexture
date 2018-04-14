import React from 'react'
import { storiesOf } from '@storybook/react'
import OperatorMenu from '../../../src/queryBuilder/OperatorMenu'

export default (parent, root) =>
  storiesOf('QueryBuilder/Internals/OperatorMenu', module).add('OperatorMenu', () => (
    <OperatorMenu {...{ tree: { join: 'and' }, parent, root }} />
  ))
