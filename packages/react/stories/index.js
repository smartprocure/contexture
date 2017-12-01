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
storiesOf('Popover', module)
  .add('Show', () => <Popover show={() => true}>Contents</Popover>)
  .add('Hide', () => <Popover show={() => false}>Contents</Popover>)

import OperatorMenu from '../src/components/OperatorMenu'
import FilterContents from '../src/components/FilterContents'
import Operator from '../src/components/Operator'

let parent = {
  lens: {
    wrapHover: F.objectLens(),
    removeHover: F.objectLens(),
    joinHover: F.objectLens()
  }
}
let root = {
  join: action('join'),
  indent: action('indent'),
  remove: action('remove'),
  typeChange: action('typeChange'),
  types: {
    testType: {},
    testType2: {}
  }
}

storiesOf('OperatorMenu', module)
  .add('OperatorMenu', () => (
    <OperatorMenu {...{tree: {join: 'and'}, parent, root}} />
  ))

storiesOf('FilterContents', module)
  .add('FilterContents', () => (
    <FilterContents
      node={{
        type: 'test',
        key: 'testKey'
      }}
      root={root}
    />
  ))

let operatorStory = (join, index) => () => (
  <Operator
    {...{
      tree: {join},
      child: {
        join: 'and'
      },
      root,
      index,
      parent
    }}
  />
)
storiesOf('Operator', module)
  .add('and', operatorStory('and', 1))
  .add('or', operatorStory('or', 1))
  .add('not', operatorStory('not', 1))
  .add('first and', operatorStory('and', 0))
  .add('first or', operatorStory('or', 0))
  .add('first not', operatorStory('not', 0))
