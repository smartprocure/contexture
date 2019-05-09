import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

storiesOf('Components (Grey Vest)|Refs', module).addWithJSX(
  'Default',
  require('./refs').default
)
