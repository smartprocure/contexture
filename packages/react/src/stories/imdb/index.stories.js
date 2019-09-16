import 'babel-polyfill'
import { storiesOf } from '@storybook/react'
import ThemePicker from '../themePicker'

storiesOf('Live Demos|IMDB Search/Legacy demos', module)
  .add('Filter List', require('./filterList').default)
  .add('Search Button', require('./searchButton').default)

storiesOf('Live Demos|IMDB Search', module)
  .addDecorator(ThemePicker('blueberry'))
  .add('Custom Result Components', require('./resultComponents').default)

storiesOf('Live Demos|IMDB Search', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Dynamic Search Layout', require('./searchLayout').default)
