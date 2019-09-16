import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { observable } from 'mobx'
import ThemePicker from '../stories/themePicker'
import { TreePauseButton } from '.'
import { SearchTree } from '..'

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

storiesOf('Components|Search Components/Internals/TreePauseButton', module)
  .addDecorator(ThemePicker('greyVest'))
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
  .addWithJSX('Falsey Trees', () => (
    <TreePauseButton>
      <SearchTree tree={tree} path={['root']} />
      {false && <SearchTree tree={tree} path={['root']} />}
    </TreePauseButton>
  ))
