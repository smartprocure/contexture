import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

storiesOf('Live Demos|Index Explorer', module)
  .add('Advanced Search', require('./advanced').default)
  .add('Basic Search', require('./basic').default)
