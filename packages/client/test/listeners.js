import _ from 'lodash/fp'
import ContextureClient from '../src'
import mockService from '../src/mockService'
import { observable, toJS, set } from 'mobx'

let mobxAdapter = { snapshot: toJS, extend: set, initObject: observable }
let ContextureMobx = _.curry((x, y) =>
  ContextureClient({ ...mobxAdapter, ...x })(y)
)

let AllTests = ContextureClient => {
  describe('listeners', () => {
    it('watchNode', async () => {
      let service = jest.fn(mockService({ delay: 10 }))
      let tree = ContextureClient(
        { service, debounce: 1 },
        {
          key: 'root',
          join: 'and',
          children: [
            {
              key: 'filter',
              type: 'facet',
              field: 'facetfield',
              values: ['some value'],
            },
            { key: 'results', type: 'results' },
          ],
        }
      )
      let filterDom = ''
      let resultsDom = ''
      let filterWatcher = jest.fn(node => {
        filterDom = `<div>
  <h1>Facet</h1>
  <b>Field: ${node.field}</>
  values: ${_.join(', ', node.values)}
</div>`
      })
      let resultWatcher = jest.fn(node => {
        resultsDom = `<table>${_.map(
          result =>
            `\n<tr>${_.map(val => `<td>${val}</td>`, _.values(result))}</tr>`,
          node.context.results
        )}
</table>`
      })
      tree.watchNode(['root', 'filter'], filterWatcher)
      tree.watchNode(['root', 'results'], resultWatcher)
      expect(filterDom).toBe('')
      let action = tree.mutate(['root', 'filter'], { values: ['other Value'] })
      expect(filterDom).toBe(`<div>
  <h1>Facet</h1>
  <b>Field: facetfield</>
  values: other Value
</div>`)
      expect(resultsDom).toBe(`<table>\n</table>`)
      await action

      expect(resultsDom).toBe(`<table>
<tr><td>some result</td></tr>
</table>`)

      expect(filterWatcher).toBeCalledTimes(4) // mark for update, updating, results, not updating
      expect(resultWatcher).toBeCalledTimes(9)
    })
    it('watchNode with keys', async () => {
      let service = jest.fn(mockService({ delay: 10 }))
      let tree = ContextureClient(
        { service, debounce: 1 },
        {
          key: 'root',
          join: 'and',
          children: [
            {
              key: 'filter',
              type: 'facet',
              field: 'facetfield',
              values: ['some value'],
            },
            { key: 'results', type: 'results' },
          ],
        }
      )
      let filterDom = ''
      let resultsDom = ''
      let filterWatcher = jest.fn(node => {
        filterDom = `<div>
  <h1>Facet</h1>
  <b>Field: ${node.field}</>
  values: ${_.join(', ', node.values)}
</div>`
      })
      let resultWatcher = jest.fn(node => {
        resultsDom = `<table>${_.map(
          result =>
            `\n<tr>${_.map(val => `<td>${val}</td>`, _.values(result))}</tr>`,
          node.context.results
        )}
</table>`
      })
      tree.watchNode(['root', 'filter'], filterWatcher, ['field', 'values'])
      tree.watchNode(['root', 'results'], resultWatcher, ['context.results'])
      expect(filterDom).toBe('')
      let action = tree.mutate(['root', 'filter'], { values: ['other Value'] })
      expect(filterDom).toBe(`<div>
  <h1>Facet</h1>
  <b>Field: facetfield</>
  values: other Value
</div>`)
      expect(resultsDom).toBe('') // hasn't run yet
      await action

      expect(resultsDom).toBe(`<table>
<tr><td>some result</td></tr>
</table>`)

      expect(filterWatcher).toBeCalledTimes(1) // mark for update, updating, results, not updating
      expect(resultWatcher).toBeCalledTimes(1)
    })
    it('watchNode on children', async () => {
      let service = jest.fn(mockService({ delay: 10 }))
      let tree = ContextureClient(
        { service, debounce: 1 },
        {
          key: 'root',
          join: 'and',
          children: [
            {
              key: 'criteria',
              join: 'and',
              children: [
                {
                  key: 'filter',
                  type: 'facet',
                  field: 'facetfield',
                  values: ['some value'],
                },
              ],
            },
            { key: 'results', type: 'results' },
          ],
        }
      )
      let criteriaKeys = []
      tree.watchNode(
        ['root', 'criteria'],
        node => {
          criteriaKeys = _.map('key', node.children)
        },
        ['children']
      )
      tree.add(['root', 'criteria'], {
        key: 'newFilter',
        type: 'facet',
        field: 'facetfield2',
        values: ['otherValues'],
      })
      expect(criteriaKeys).toEqual(['filter', 'newFilter'])
    })
    it('watchNode with changing keys', async () => {
      let service = jest.fn(mockService({ delay: 10 }))
      let tree = ContextureClient(
        { service, debounce: 1 },
        {
          key: 'root',
          join: 'and',
          children: [
            {
              key: 'filter',
              type: 'facet',
              field: 'facetfield',
              values: ['some value'],
            },
            { key: 'results', type: 'results' },
          ],
        }
      )

      let keys = ['context.results']
      // Mutating the original keys will change what's watched
      let resultWatcher = jest.fn(() => {
        keys[0] = 'pageSize'
      })
      tree.watchNode(['root', 'results'], resultWatcher, keys)
      await tree.mutate(['root', 'filter'], { values: ['other Value'] })
      expect(resultWatcher).toBeCalledTimes(1)
      await tree.mutate(['root', 'filter'], { values: ['other Value 2'] })

      expect(resultWatcher).toBeCalledTimes(1)
      await tree.mutate(['root', 'results'], { pageSize: 2 })
      expect(resultWatcher).toBeCalledTimes(2)
    })
  })
}

describe('lib', () => AllTests(ContextureClient))
describe('mobx', () => AllTests(ContextureMobx))
