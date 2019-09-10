import React from 'react'
import { storiesOf } from '@storybook/react'
import OperatorMenu from '../../../../src/queryBuilder/OperatorMenu'

export default (parent, root) =>
  storiesOf(
    'Components|Search Components/QueryBuilder/Internals',
    module
  ).addWithJSX('OperatorMenu', () => (
    <OperatorMenu {...{ node: { join: 'and' }, parent, root }} />
  ))
