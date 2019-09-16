import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import AddPreview from './AddPreview'

storiesOf(
  'Components|Search Components/QueryBuilder/Internals/AddPreview',
  module
)
  .add('and', () => <AddPreview onClick={action('join')} join="and" />)
  .add('or', () => <AddPreview onClick={action('join')} join="or" />)
  .add('not', () => <AddPreview onClick={action('join')} join="not" />)
