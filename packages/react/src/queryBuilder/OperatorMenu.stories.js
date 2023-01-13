import React from 'react'
import { storiesOf } from '@storybook/react'
import { parent, root } from './stories/util.js'
import OperatorMenu from './OperatorMenu.js'

storiesOf('Search Components|QueryBuilder/Internals', module).add(
  'OperatorMenu',
  () => <OperatorMenu {...{ node: { join: 'and' }, parent, root }} />
)
