import React from 'react'
import * as F from 'futil-js'
import { action } from '@storybook/addon-actions'
import DDContext from '../../../src/queryBuilder/DragDrop/DDContext'

let DnDWrap = DDContext(({ children }) => <div>{children}</div>)
const DnDDecorator = storyFn => <DnDWrap>{storyFn()}</DnDWrap>

let parent = {
  lens: {
    wrapHover: F.objectLens(),
    removeHover: F.objectLens(),
    joinHover: F.objectLens(),
  },
}
let root = {
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
export default () => {
  require('./operatorMenu').default(parent, root)
  require('./operator').default(parent, root, DnDDecorator)
  require('./addPreview').default(parent, root, DnDDecorator)
  require('./indentable').default(parent, root, DnDDecorator)
  require('./filterContents').default(parent, root)
  require('./rule').default(parent, root, DnDDecorator)
  require('./group').default(parent, root, DnDDecorator)
}
