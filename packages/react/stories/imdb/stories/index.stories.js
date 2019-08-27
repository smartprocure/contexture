import 'babel-polyfill'
import { storiesOf } from '@storybook/react'
import GVDecorator from '../../greyVest/decorator'

storiesOf('Live Demos|IMDB', module)
  .addWithJSX('Advanced Search', require('./advanced').default)
  .addWithJSX('Filter List', require('./filterList').default)
  .addWithJSX('Search Button', require('./searchButton').default)
  .addWithJSX('Blueberry Theme', require('./blueberry').default)

storiesOf('Live Demos|IMDB', module)
  .addDecorator(GVDecorator)
  .addWithJSX('Check List', require('./checklist').default)
  .addWithJSX('Grey Vest Theme', require('./greyVest').default)
  .addWithJSX(
    'Grey Vest Theme with Theme API',
    require('./greyVestThemed').default
  )
