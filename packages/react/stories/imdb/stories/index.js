import 'babel-polyfill'
import React from 'react'
import { storiesOf } from '@storybook/react'
import { Styles } from '../../../src/exampleTypes/'

let demoBox = {
  backgroundColor: '#333',
  color: '#AAA',
  padding: '20px',
  borderRadius: '10px',
}
export default () =>
  storiesOf('IMDB', module)
    .addDecorator(storyFn => (
      <div>
        <Styles />
        {storyFn()}
      </div>
    ))
    .addWithJSX('Advanced Search', require('./advanced').default)
    .addDecorator(story => <div style={demoBox}>{story()}</div>)
    .addWithJSX('Quick Start', require('./quickStart').default)
    .addWithJSX('Filter List', require('./filterList').default)
