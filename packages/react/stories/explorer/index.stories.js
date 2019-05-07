import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

storiesOf('Components (Unthemed)|Index Explorer', module)
  .addWithJSX('Advanced Search', require('./advanced').default)
  .addWithJSX('Basic Search', require('./basic').default)
