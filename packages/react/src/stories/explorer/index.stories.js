import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

storiesOf('Live Demos|Index Explorer', module)
  .add('Advanced Search', require('./advanced.js').default)
  .add('Basic Search', require('./basic.js').default)
