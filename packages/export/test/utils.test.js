import _ from 'lodash/fp'
import { setFilterOnly } from '../src/utils'
import { schemaToCSVTransforms } from '../src/modern/schemaToCSVTransforms'

describe('utils', () => {
  it('setFilterOnly', async () => {
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
  it('schema Transforms', () => {
    let { transform } = schemaToCSVTransforms({
      a: { display: () => 'b' },
    })
    expect(transform({ a: 2 })).toEqual({ a: 'b' })
  })
})
