import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import AddPreview from '../../../src/queryBuilder/preview/AddPreview'

export default () =>
  storiesOf('QueryBuilder/Internals/AddPreview', module)
    .addWithJSX('and', () => <AddPreview onClick={action('join')} join="and" />)
    .addWithJSX('or', () => <AddPreview onClick={action('join')} join="or" />)
    .addWithJSX('not', () => <AddPreview onClick={action('join')} join="not" />)
