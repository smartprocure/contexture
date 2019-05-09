import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

storiesOf('Live Demos|Index Explorer', module)
  .addWithJSX('Advanced Search', require('./advanced').default)
  .addWithJSX('Basic Search', require('./basic').default)
