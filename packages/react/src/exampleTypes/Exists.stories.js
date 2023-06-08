import _ from 'lodash/fp.js'
import TestTree from './stories/testTree.js'
import Component from './Exists.js'

export default {
  component: Component,
  args: {
    tree: TestTree(),
    path: ['exists'],
  },
}

export const Default = {}

export const Customized = {
  args: {
    display: (value) =>
      _.isNil(value) ? 'Both' : value ? 'There' : 'Not there',
  },
}
