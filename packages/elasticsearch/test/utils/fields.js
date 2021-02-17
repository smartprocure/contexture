let { getField } = require('../../src/utils/fields')
let { expect } = require('chai')

describe('field utils', () => {
  it('getField should work', () => {
    let schema = {
      fields: {
        field1: { elasticsearch: { notAnalyzedField: 'untouched' } },
        field2: { elasticsearch: { notAnalyzedField: 'raw' } },
        field3: {},
      },
    }
    expect(getField(schema, 'field1')).to.eql('field1.untouched')
    expect(getField(schema, 'field2')).to.eql('field2.raw')
    expect(getField(schema, 'field3')).to.eql('field3')
  })
})
