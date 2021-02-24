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
  it('schemaTransforms', () => {
    let { transform, transformHeaders } = schemaToCSVTransforms({
      a: { display: () => 2 },
      b: { label: 'Field B' },
    }, { header: false, include: ['a', 'b'] })
    // Display
    expect(transform({ a: 1})).toEqual({ a: 2 })
    // No display but label
    expect(transform({ a: 1, b: 1 })).toEqual({ a: 2, b: 1 })
    // Field not in config
    expect(transform({ a: 1, c: 1 })).toEqual({ a: 2})
    // Empty object
    expect(transform({})).toEqual({})
    // Default header transformation (_.startCase)
    expect(transformHeaders('a')).toEqual('A')
    // Explicit label
    expect(transformHeaders('b')).toEqual('Field B')
  })
  it('schemaTransforms nested fields', () => {
    let { transform } = schemaToCSVTransforms({
      'person.age': { display: x => `${x} years` },
    }, { header: false })
    expect(transform({ person: { age: 10 } })).toEqual({
      person: { age: '10 years' },
    })
  })
  it('schemaTransforms displayDefault', () => {
    let { transform } = schemaToCSVTransforms({}, {
      include: ['person.age'],
      header: false,
      displayDefault: x => `${x} years`,
    })
    expect(transform({ person: { age: 10 } })).toEqual({
      person: { age: '10 years'},
    })
  })
  it('schemaTransforms no config', () => {
    let { transform } = schemaToCSVTransforms()
    expect(transform({ a: 10 })).toEqual({ a: 10 })
  })
})
