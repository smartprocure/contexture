import { getField } from './fields.js'

describe('field utils', () => {
  it('getField should work', () => {
    let schema = {
      fields: {
        field1: { elasticsearch: { notAnalyzedField: 'untouched' } },
        field2: { elasticsearch: { notAnalyzedField: 'raw' } },
        field3: {},
      },
    }
    expect(getField(schema, 'field1')).toEqual('field1.untouched')
    expect(getField(schema, 'field2')).toEqual('field2.raw')
    expect(getField(schema, 'field3')).toEqual('field3')
  })
})
