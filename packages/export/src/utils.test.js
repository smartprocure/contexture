import { setFilterOnly } from '../src/utils'
import { schemaToCSVTransforms } from '../src/schemaToCSVTransforms'

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
})
