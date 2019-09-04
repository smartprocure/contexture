import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

storiesOf('Components|GreyVest', module).addWithJSX(
  'refs',
  require('./refs').default
)
