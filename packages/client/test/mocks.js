import * as F from 'futil-js'
import { Tree } from '../src/util/tree'

export let defaultMocks = {
  results: {
    count: 1,
    results: [
      {
        title: 'some result',
      },
    ],
  },
  testType: {
    option: 'asdf',
  },
}
export let mockService = ({
  mocks = defaultMocks,
  logInput,
  logOutput,
} = {}) => (dto, lastUpdateTime) => {
  if (logInput) console.info('dto', JSON.stringify(dto, 0, 2))
  let result = {
    data: Tree.transform(node => {
      let context = mocks[node.type]
      if (!node.filterOnly && context) {
        F.extendOn(node, {
          context,
          lastUpdateTime,
        })
      }
    }, dto),
  }
  if (logOutput) console.info('result', JSON.stringify(result, 0, 2))
  return result
}

// Used to allow shorthand syntax, e.g. mockService({ logInput })
export let logInput = true
export let logOutput = true
