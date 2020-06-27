let { expect } = require('chai')
let utils = require('./testUtils')
let dateRangeFacet = require('../../src/example-types/dateRangeFacet')

let commonFilterParts = {
  type: 'dateRangeFacet',
  field: 'test',
  ranges: [
    { from: 'now/d', key: "open" },
    { to: 'now-1d/d', key: "expired" },
    { from: 'now-30d/d', to: 'now/d', key: "foo" }
  ],
}

describe('validContext', () => {
  it('should validate a context with all required fields', () => {
    expect(dateRangeFacet.validContext({
      field: 'value_field',
      ranges: [{ key: "asd", to: "now/d", from: "nod-1d/d" }],
    })).to.be.true
  })
  it('should invalidate a context with no ranges prop', () => {
    expect(dateRangeFacet.validContext({
      field: 'value_field'
    })).to.be.false
  })
  it('should invalidate a context with missing range key', () => {
    expect(dateRangeFacet.validContext({
      field: 'value_field',
      ranges: [{ to: "now/d" }],
    })).to.be.false
  })
  it('should invalidate a context with no range "from" or "to"', () => {
    expect(dateRangeFacet.validContext({
      field: 'value_field',
      ranges: [{ key: "foo" }],
    })).to.be.false
  })
})

describe('dateRangeFacet/filter', () => {
  it('should handle "from"', () => {
    expect(
      dateRangeFacet.filter({
        ...commonFilterParts,
        values: ["open"]
      })
    ).to.deep.equal({
      bool : {
        should : [
          { range : { test: { from: "now/d" } } }
        ]
      }
    })
  })
  it('should handle "to"', () => {
    expect(
      dateRangeFacet.filter({
        ...commonFilterParts,
        values: ["expired"]
      })
    ).to.deep.equal({
      bool : {
        should : [
          { range : { test: { to: "now-1d/d" } } }
        ]
      }
    })
  })
  it('should handle "from" and "to"', () => {
    expect(
      dateRangeFacet.filter({
        ...commonFilterParts,
        values: ["open", "expired", "foo"]
      })
    ).to.deep.equal({
      bool : {
        should : [
          { range : { test: { from: "now/d" } } },
          { range : { test: { to: "now-1d/d" } } },
          { range : { test: { from: 'now-30d/d', to: 'now/d' } } }
        ]
      }
    })
  })
})

describe('dateRangeFacet/result', () => {
  it('should work', () => {
    utils.sequentialResultTest([
      {
        "aggregations": {
          "range": {
            "buckets": [
              {
                "key": "Expired",
                "to": 1.5930432E12,
                "to_as_string": "06-2020",
                "doc_count": 6639865
              },
              {
                "key": "Open",
                "from": 1.5931296E12,
                "from_as_string": "06-2020",
                "doc_count": 75882
              }
            ]
          }
        }
      }
    ],
    {
      field: 'test',
      type: 'dateRangeFacet',
      ranges: [
        { from: 'now/d', key: 'Open' },
        { to: 'now-1d/d', key: 'Expired' }
      ]
    },
    [
      { name: 'Open', count: 75882 },
      { name: 'Expired', count: 6639865 }
    ],
    {
      aggs: {
        range: {
          date_range: {
            field:  'test',
            format: 'MM-yyyy',
            ranges: [
              { from: 'now/d', key: 'Open' }
            ]
          }
        }
      },
      size: 0
    })
  })
})
