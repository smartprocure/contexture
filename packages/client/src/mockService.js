import * as F from 'futil-js'
import { Tree } from '../src/util/tree'

export let defaultMocks = ({type}) => ({
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
}[type])

export default  ({
  mocks = defaultMocks,
  logInput,
  logOutput,
} = {}) => (dto, lastUpdateTime) => {
  if (logInput) console.info('dto', JSON.stringify(dto, 0, 2))
  let result = Tree.transform(node => {
    let context = mocks(node)
    if (!node.filterOnly && context) {
      F.extendOn(node, {
        context,
        lastUpdateTime,
      })
    }
  }, dto)
  if (logOutput) console.info('result', JSON.stringify(result, 0, 2))
  return result
}
