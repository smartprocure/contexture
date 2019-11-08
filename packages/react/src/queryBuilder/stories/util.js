import React from 'react'
import * as F from 'futil'
import { action } from '@storybook/addon-actions'
import DDContext from '../DragDrop/DDContext'

let DnDWrap = DDContext(({ children }) => <div>{children}</div>)

export let DnDDecorator = storyFn => <DnDWrap>{storyFn()}</DnDWrap>

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

/* TODO: Remove this. Left it so git detects this as a file rename
require('./operatorMenu').default(parent, root)
require('./operator').default(parent, root, DnDDecorator)
require('./addPreview').default(parent, root, DnDDecorator)
require('./indentable').default(parent, root, DnDDecorator)
require('./filterContents').default(parent, root)
require('./rule').default(parent, root, DnDDecorator)
require('./group').default(parent, root, DnDDecorator)
*/
