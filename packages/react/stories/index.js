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
  add: action('add'),
  move: action('move'),
  types: {
    testType: {},
    testType2: {}
  }
}

import OperatorMenu from '../src/components/OperatorMenu'
storiesOf('OperatorMenu', module).add('OperatorMenu', () => (
  <OperatorMenu {...{tree: {join: 'and'}, parent, root}} />
))

import FilterContents from '../src/components/FilterContents'
storiesOf('FilterContents', module).add('FilterContents', () => (
  <FilterContents
    node={{
      type: 'test',
      key: 'testKey'
    }}
    root={root}
  />
))

import Operator from '../src/components/Operator'
let operatorStory = (join, index) => () => (
  <Operator
    {...{
      tree: {join},
      child: {
        join: 'and'
      },
      root,
      index,
      parent,
      noDrop: true
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

import AddPreview from '../src/components/preview/AddPreview'
storiesOf('AddPreview', module)
  .add('and', () => <AddPreview onClick={action('join')} join="and" />)
  .add('or', () => <AddPreview onClick={action('join')} join="or" />)
  .add('not', () => <AddPreview onClick={action('join')} join="not" />)

import Indentable from '../src/components/preview/Indentable'
storiesOf('Indentable', module)
  .add('and', () => (
    <Indentable indent={() => true} tree={{join: 'and'}}>
      <div style={{height: '100px'}}>Contents</div>
    </Indentable>
  ))
  .add('or', () => (
    <Indentable indent={() => true} tree={{join: 'or'}}>
      <div style={{height: '100px'}}>Contents</div>
    </Indentable>
  ))
  .add('not', () => (
    <Indentable indent={() => true} tree={{join: 'not'}}>
      <div style={{height: '100px'}}>Contents</div>
    </Indentable>
  ))
