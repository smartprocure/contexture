import React from 'react'
import F from 'futil'
import { action } from '@storybook/addon-actions'
import DDContext from '../DragDrop/DDContext.js'

let DnDWrap = DDContext(({ children }) => <div>{children}</div>)

export let DnDDecorator = (storyFn) => <DnDWrap>{storyFn()}</DnDWrap>

export let parent = {
  lens: {
    wrapHover: F.objectLens(),
    removeHover: F.objectLens(),
    joinHover: F.objectLens(),
  },
}

export let root = {
  join: action('join'),
  indent: action('indent'),
  remove: action('remove'),
  typeChange: action('typeChange'),
  add: action('add'),
  move: action('move'),
  mutate: action('mutate'),
  types: {
    testType: {},
    testType2: {},
  },
}
