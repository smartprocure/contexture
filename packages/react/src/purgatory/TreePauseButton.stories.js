import React from 'react'
import { action } from '@storybook/addon-actions'
import { observable } from '../utils/mobx.js'
import { SearchTree } from '../index.js'
import Component from './TreePauseButton.js'

export default {
  component: Component,
}

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

export const OneTree = () => (
  <Component>
    <SearchTree tree={tree} path={['root']} />
  </Component>
)

export const MultipleTrees = () => (
  <Component>
    <SearchTree tree={tree} path={['root']} />
    <SearchTree tree={tree} path={['root']} />
  </Component>
)

export const FalseyTrees = () => (
  <Component>
    <SearchTree tree={tree} path={['root']} />
    {false && <SearchTree tree={tree} path={['root']} />}
  </Component>
)
