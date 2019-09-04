import 'babel-polyfill'
import { storiesOf } from '@storybook/react'
import ThemePicker from '../../themePicker'

storiesOf('Live Demos|IMDB Search/Legacy demos', module)
  .addWithJSX('Filter List', require('./filterList').default)
  .addWithJSX('Search Button', require('./searchButton').default)

storiesOf('Live Demos|IMDB Search', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('Advanced Search', require('./advanced').default)

storiesOf('Live Demos|IMDB Search', module)
  .addDecorator(ThemePicker('blueberry'))
  .addWithJSX('Checkable Result Table', require('./checklist').default)

storiesOf('Live Demos|IMDB Search', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('Dynamic Search Layout', require('./searchLayout').default)
