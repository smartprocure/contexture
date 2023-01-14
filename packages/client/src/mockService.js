import Promise from 'bluebird'
import F from 'futil'
import { Tree } from './util/tree.js'

export let defaultMocks = ({ type }) =>
  ({
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

export default ({ mocks = defaultMocks, logInput, logOutput, delay } = {}) =>
  async (dto, lastUpdateTime) => {
    if (delay) await Promise.delay(delay)
    if (logInput) console.info('dto', JSON.stringify(dto, 0, 2))
    let result = Tree.transform((node) => {
      let context = mocks(node)
      if (!node.filterOnly && context) {
        let extending = context.context ? context : { context }
        F.extendOn(node, { ...extending, lastUpdateTime })
      }
    }, dto)
    if (logOutput) console.info('result', JSON.stringify(result, 0, 2))
    return result
  }
