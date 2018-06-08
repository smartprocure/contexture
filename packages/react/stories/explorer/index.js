import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

export default () =>
  storiesOf('Index Explorer', module)
    .addWithJSX('Advanced Search', require('./advanced').default)
    .addWithJSX('Basic Search', require('./basic').default)
