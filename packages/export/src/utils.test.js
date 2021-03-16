import { setFilterOnly, flattenProp } from './utils'

describe('utils', () => {
  it('setFilterOnly', () => {
    let tree = {
      key: 'root',
      children: [
        { key: 'a', type: 'facet', field: 'a' },
        { key: 'b', type: 'facet', field: 'b' },
        { key: 'results', type: 'results' },
      ],
    }
    let filtered = setFilterOnly(tree)
    expect(filtered).toEqual({
      filterOnly: true,
      key: 'root',
      children: [
        { filterOnly: true, key: 'a', type: 'facet', field: 'a' },
        { filterOnly: true, key: 'b', type: 'facet', field: 'b' },
        { filterOnly: true, key: 'results', type: 'results' },
      ],
    })
  })
  it('flattenProp', () => {
    expect(flattenProp('_source', { _source: { a: 1 }, b: 2 })).toEqual({
      a: 1,
      b: 2,
    })
  })
})
