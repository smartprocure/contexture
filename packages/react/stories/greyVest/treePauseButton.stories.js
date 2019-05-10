import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { observable } from 'mobx'
import decorator from './decorator'
import { TreePauseButton, SearchTree } from './../../src/themes/greyVest'

let pauseWith = action('set paused')

let state = observable({ paused: true })
let tree = {
  pauseNested() {
    pauseWith((state.paused = true))
  },
  unpauseNested() {
    pauseWith((state.paused = false))
  },
  isPausedNested: () => state.paused,
}

storiesOf('Search Components (Grey Vest)|/TreePauseButton', module)
  .addDecorator(decorator)
  .addWithJSX('One Tree', () => (
    <TreePauseButton>
      <SearchTree tree={tree} path={['root']} />
    </TreePauseButton>
  ))
  .addWithJSX('Multiple Trees', () => (
    <TreePauseButton>
      <SearchTree tree={tree} path={['root']} />
      <SearchTree tree={tree} path={['root']} />
    </TreePauseButton>
  ))
