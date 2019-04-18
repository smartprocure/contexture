import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

storiesOf('Index Explorer', module)
  .addWithJSX('Advanced Search', require('./advanced').default)
  .addWithJSX('Basic Search', require('./basic').default)
