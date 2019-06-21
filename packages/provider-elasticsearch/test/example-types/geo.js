const geoType = require('../../src/example-types/geo')
const utils = require('./testUtils')
let { expect } = require('chai')
let chai = require('chai')
let chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

describe('geo', () => {
  let geo = geoType({
    geocodeLocation: () => ({
      latitude: 26.3170479,
      longitude: -80.1131784,
    }),
  })

  it('hasValue should work', () => {
    utils.hasValueContexts(geo)([
      {
        location: true,
        radius: true,
        operator: true,
      },
      {
        location: true,
        radius: -1,
        operator: true,
      },
      {
        location: 'SmartProcure',
        radius: 10,
        operator: 'within',
      },
    ])
    utils.noValueContexts(geo)([
      {},
      {
        location: false,
        radius: 10,
        operator: 'within',
      },
      {
        location: '',
        radius: 10,
        operator: 'within',
      },
      {
        radius: 10,
        operator: 'within',
      },
      {
        location: true,
        radius: 0,
        operator: 'within',
      },
      {
        location: true,
        radius: false,
        operator: 'within',
      },
      {
        location: true,
        operator: 'within',
      },
      {
        location: true,
        radius: 10,
        operator: false,
      },
      {
        location: true,
        radius: 10,
        operator: '',
      },
      {
        location: true,
        radius: 10,
      },
    ])
  })

  describe('filter', () => {
    it('should filter properly', () => {
      expect(
        geo.filter({
          type: 'geo',
          field: 'test',
          location: 'SmartProcure',
          radius: 10,
          operator: 'within',
          _meta: {},
        })
      ).to.become({
        geo_distance: {
          test: '26.3170479,-80.1131784',
          distance: '10mi',
        },
      })
    })
    it('should filter properly outside', () => {
      expect(
        geo.filter({
          type: 'geo',
          field: 'test',
          location: 'SmartProcure',
          radius: 15,
          operator: 'outside',
          _meta: {},
        })
      ).to.eventually.deep.equal({
        bool: {
          must_not: {
            geo_distance: {
              test: '26.3170479,-80.1131784',
              distance: '15mi',
            },
          },
        },
      })
    })
  })

  it('validContext should work', () => {
    utils.validContexts(geo)([
      {
        location: true,
        radius: 1,
        operator: true,
      },
      {
        location: 'SmartProcure',
        radius: 10,
        operator: 'within',
      },
    ])
    utils.noValidContexts(geo)([
      {},
      {
        location: false,
        radius: 10,
        operator: 'within',
      },
      {
        location: '',
        radius: 10,
        operator: 'within',
      },
      {
        radius: 10,
        operator: 'within',
      },
      {
        location: true,
        radius: 0,
        operator: 'within',
      },
      {
        location: true,
        operator: 'within',
      },
      {
        location: true,
        radius: 10,
        operator: false,
      },
      {
        location: true,
        radius: 10,
        operator: '',
      },
      {
        location: true,
        radius: 10,
      },
    ])
  })

  it('result should work', () => {
    let context = {
      type: 'geo',
      field: 'test',
      location: 'SmartProcure',
      radius: 10,
      operator: 'within',
      _meta: {},
    }
    return expect(
      geo.filter(context).then(() => geo.result(context))
    ).to.become({
      Latitude: 26.3170479,
      Longitude: -80.1131784,
    })
  })
  it('Should faild is no geoCodeLocation service is passed', () => {
    let _geo = geoType()
    let context = {
      type: 'geo',
      field: 'test',
      location: 'SmartProcure',
      radius: 10,
      operator: 'within',
      _meta: {},
    }
    return expect(Promise.resolve(_geo.filter(context))).to.throw
  })
})
