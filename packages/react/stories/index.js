import React from 'react'
import {observable} from 'mobx'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {withInfo} from '@storybook/addon-info'

import DDContext from '../src/components/DragDrop/DDContext'
let DnDWrap = DDContext(({children}) => <div>{children}</div>)
const DnDDecorator = storyFn => <DnDWrap>{storyFn()}</DnDWrap>

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
  .addDecorator(DnDDecorator)
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

import Rule from '../src/components/Rule'
storiesOf('Rule', module)
  .addDecorator(DnDDecorator)
  .add('index', () => (
    <Rule
      node={{
        type: 'test',
        key: 'testKey'
      }}
      tree={{
        join: 'and'
      }}
      root={root}
    />
  ))

import Group from '../src/components/Group'
storiesOf('Group', module)
  .addDecorator(DnDDecorator)
  .add('One Filter', () => (
    <Group
      tree={{
        key: 'root',
        join: 'and',
        children: [{key: 'filter 1', type: 'query'}]
      }}
      root={root}
      isRoot={true}
    />
  ))
  .add('Multiple Filters', () => (
    <Group
      tree={{
        key: 'root',
        join: 'and',
        children: [
          {type: 'query', key: 'filter 1'},
          {
            key: 'group1',
            join: 'or',
            children: [
              {type: 'query', key: 'filter 2a'},
              {type: 'query', key: 'filter 2b'},
              {
                key: 'group2',
                join: 'and',
                children: [
                  {
                    key: 'filter 4a',
                    type: 'facet'
                  },
                  {type: 'query', key: 'filter 4b'}
                ]
              }
            ]
          },
          {type: 'query', key: 'filter 3'},
          {
            key: 'group2',
            join: 'not',
            children: [
              {key: 'filter 5a', type: 'number'},
              {type: 'query', key: 'filter 5b'}
            ]
          },
          {
            key: 'group24',
            join: 'or',
            children: [
              {
                key: 'group2',
                join: 'and',
                children: [
                  {type: 'query', key: 'filter 4a'},
                  {key: 'txt filter 4b', type: 'text'}
                ]
              },
              {
                key: 'asdf',
                typ: 'query'
              }
            ]
          }
        ]
      }}
      root={root}
      isRoot={true}
    />
  ))

import SearchRoot, {NewNode} from '../src/components/SearchRoot'
import Types from '../src/exampleTypes'
let Node = NewNode(Types)
storiesOf('SearchRoot', module)
  .add('One Filter', () => (
    <SearchRoot
      tree={observable({
        key: 'root',
        join: 'and',
        children: [{key: 'filter 1', type: 'query'}]
      })}
      types={Types}
    />
  ))
  .add('Multiple Filters', () => (
    <SearchRoot
      tree={observable({
        key: 'root',
        join: 'and',
        children: [
          Node('query', 'filter 1'),
          {
            key: 'group1',
            join: 'or',
            children: [
              Node('query', 'filter 2a'),
              Node('query', 'filter 2b'),
              {
                key: 'group2',
                join: 'and',
                children: [
                  Node('facet', 'filter 4a'),
                  Node('query', 'filter 4b')
                ]
              }
            ]
          },
          Node('query', 'filter 3'),
          {
            key: 'group2',
            join: 'not',
            children: [
              Node('number', 'filter 5a'),
              Node('query', 'filter 5b')
            ]
          },
          {
            key: 'group24',
            join: 'or',
            children: [
              {
                key: 'group2',
                join: 'and',
                children: [
                  Node('query', 'filter 4a'),
                  Node('text', 'txt filter 4b')
                ]
              },
              Node('query', 'asdf')
            ]
          }
        ]
      })}
      types={Types}
    />
  ))
