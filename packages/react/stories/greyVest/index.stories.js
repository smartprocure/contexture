import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

storiesOf('Non Search Components|Grey Vest', module).addWithJSX(
  'Refs',
  require('./refs').default
)
