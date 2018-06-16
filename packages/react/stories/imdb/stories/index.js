import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

export default () =>
  storiesOf('IMDB', module)
    .addWithJSX('Advanced Search', require('./advanced').default)
    .addWithJSX('Quick Start', require('./quickStart').default)
    .addWithJSX('Filter List', require('./filterList').default)
    .addWithJSX('Search Button', require('./searchButton').default)
    .addWithJSX('Grey Vest Theme', require('./greyVest').default)
