import React from 'react'

import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {withInfo} from '@storybook/addon-info'

import * as F from 'futil-js'

storiesOf('Docs', module)
  .add(
    'README.md',
    withInfo({text: require('../README.md'), inline: true, source: false})(
      () => null
    )
  )
  .add(
    'CHANGELOG.md',
    withInfo({text: require('../CHANGELOG.md'), inline: true, source: false})(
      () => null
    )
  )

import Popover from '../src/components/Popover'
import OperatorMenu from '../src/components/OperatorMenu'

let tree = {join: 'and'}
let parent = {
  lens: {
    wrapHover: F.objectLens(),
    removeHover: F.objectLens()
  }
}

storiesOf('Internal Components', module)
  .add('Popover', () => <Popover show={() => true}>Contents</Popover>)
  .add('OperatorMenu', () => (
    <OperatorMenu {...{tree, parent /*, root, parentTree*/}} />
  ))
