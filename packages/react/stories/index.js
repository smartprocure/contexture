import React from 'react'
import * as F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import DDContext from '../src/queryBuilder/DragDrop/DDContext'

let DnDWrap = DDContext(({ children }) => <div>{children}</div>)
const DnDDecorator = storyFn => <DnDWrap>{storyFn()}</DnDWrap>

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


require('./QueryBuilder/examples').default()
require('./QueryBuilder/internals/').default()
require('./exampleTypes').default()
require('./layout').default()
