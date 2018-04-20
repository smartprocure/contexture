import 'babel-polyfill'
import React from 'react'
import { storiesOf } from '@storybook/react'
import { Styles } from '../../src/exampleTypes/'

export default () =>
  storiesOf('Index Explorer', module)
    .addDecorator(storyFn => (
      <div>
        <Styles />
        {storyFn()}
      </div>
    ))
    .addWithJSX('Advanced Search', require('./advanced').default)
