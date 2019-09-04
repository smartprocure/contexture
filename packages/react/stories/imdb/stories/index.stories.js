import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

storiesOf('Live Demos|IMDB Search', module)
  .addWithJSX('Advanced Search', require('./advanced').default)
  .addWithJSX('Filter List', require('./filterList').default)
  .addWithJSX('Search Button', require('./searchButton').default)
  .addWithJSX('Check List', require('./checklist').default)
  .addWithJSX('Themeable SearchLayout', require('./searchLayout').default)
