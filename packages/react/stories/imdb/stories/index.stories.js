import 'babel-polyfill'
import { storiesOf } from '@storybook/react'

storiesOf('Live Demos|IMDB Search', module)
  .addWithJSX('Advanced Search', require('./advanced').default)
  .addWithJSX('Filter List', require('./filterList').default)
  .addWithJSX('Search Button', require('./searchButton').default)
  .addWithJSX('Blueberry Theme', require('./blueberry').default)

storiesOf('Live Demos|IMDB Search', module)
  .addWithJSX('Check List', require('./checklist').default)
  .addWithJSX('Grey Vest Theme', require('./greyVest').default)
  .addWithJSX(
    'Grey Vest Theme with Theme API',
    require('./greyVestThemed').default
  )
