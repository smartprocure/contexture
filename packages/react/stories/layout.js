import React from 'react'
import { storiesOf } from '@storybook/react'
import Popover from '../src/layout/Popover'

export default () => storiesOf('Layout/Popover', module)
  .add('Show', () => <Popover show={() => true}>Contents</Popover>)
  .add('Hide', () => <Popover show={() => false}>Contents</Popover>)
