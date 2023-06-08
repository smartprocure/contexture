import _ from 'lodash/fp.js'
import TestTree from './stories/testTree.js'
import Component from './Bool.js'

export default {
  component: Component,
  args: {
    tree: TestTree(),
    path: ['bool'],
  },
}

export const Bool = {}

export const BoolCustomOptions = {
  args: {
    display: (value) =>
      _.isNil(value) ? 'Both' : value ? 'Agree' : 'Disagree',
  },
}
