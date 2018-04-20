import 'babel-polyfill'
import React from 'react'
import { storiesOf } from '@storybook/react'

export default () =>
  storiesOf('Index Explorer', module)
    .addWithJSX('Advanced Search', require('./advanced').default)
