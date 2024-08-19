import TestTree from './stories/testTree.js'
import Component from './StepSlider'
import { toNumber } from '../utils/format.js'

export default {
  component: Component,
  args: {
    tree: TestTree(),
    path: ['step'],
    formatter: toNumber,
  },
}

export const StepSlider = {}
