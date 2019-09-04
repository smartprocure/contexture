import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

storiesOf('Components|GreyVest library', module).addWithJSX(
  'refs',
  require('./refs').default
)
