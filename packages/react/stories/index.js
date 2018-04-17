import React from 'react'
import * as F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

storiesOf('Docs', module)
  .add(
    'README.md',
    withInfo({ text: require('../README.md'), inline: true, source: false })(
      () => null
    )
  )
  .add(
    'CHANGELOG.md',
    withInfo({ text: require('../CHANGELOG.md'), inline: true, source: false })(
      () => null
    )
  )

require('./queryBuilder/examples').default()
require('./queryBuilder/internals/').default()
require('./exampleTypes/').default()
require('./filterList').default()
require('./filterAdder').default()
require('./layout').default()
