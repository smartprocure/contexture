import React from 'react'
import { storiesOf } from '@storybook/react'
import { parent, root } from './stories/util'
import OperatorMenu from './OperatorMenu'

storiesOf('Components|Search Components/QueryBuilder/Internals', module).add(
  'OperatorMenu',
  () => <OperatorMenu {...{ node: { join: 'and' }, parent, root }} />
)
