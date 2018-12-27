import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

export default () =>
  storiesOf('Grey Vest', module).addWithJSX('Refs', require('./refs').default)
