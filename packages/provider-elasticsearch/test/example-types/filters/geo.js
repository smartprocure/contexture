const geo = require('../../../src/example-types/filters/geo')
const utils = require('../testUtils')
let { expect } = require('chai')

describe('geo', () => {
  it('hasValue should work', () => {
    utils.hasValueContexts(geo)([
      { latitude: 26, longitude: -80, radius: true, operator: true },
      { latitude: 26, longitude: -80, radius: -1, operator: true },
      { latitude: 26, longitude: -80, radius: 10, operator: 'within' },
    ])
    utils.noValueContexts(geo)([
      {},
      { location: false, radius: 10, operator: 'within' },
      { latitude: 26.3170479, radius: 10, operator: 'within' },
      { radius: 10, operator: 'within' },
      { latitude: 26, longitude: -80, radius: 0, operator: 'within' },
      { latitude: 26, longitude: -80, radius: false, operator: 'within' },
      { latitude: 26, longitude: -80, operator: 'within' },
      { latitude: 26, longitude: -80, radius: 10, operator: false },
      { latitude: 26, longitude: -80, radius: 10, operator: '' },
      { latitude: 26, longitude: -80, radius: 10 },
    ])
  })

  describe('filter', () => {
    it('should filter properly', async () => {
      expect(
        await geo.filter({
          type: 'geo',
          field: 'test',
          latitude: 26.3170479,
          longitude: -80.1131784,
          radius: 10,
          operator: 'within',
          _meta: {},
        })
      ).to.deep.equal({
        geo_distance: { test: [-80.1131784, 26.3170479], distance: '10mi' },
      })
    })
    it('should filter properly outside', async () => {
      expect(
        await geo.filter({
          type: 'geo',
          field: 'test',
          latitude: 26.3170479,
          longitude: -80.1131784,
          radius: 15,
          operator: 'outside',
          _meta: {},
        })
      ).to.deep.equal({
        bool: {
          must_not: {
            geo_distance: { test: [-80.1131784, 26.3170479], distance: '15mi' },
          },
        },
      })
    })
  })
})
