import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

export default () =>
  storiesOf('Non Search Components|Grey Vest', module).addWithJSX('Refs', require('./refs').default)
