const geoType = require('../../src/example-types/geo')
const utils = require('./testUtils')
let { expect } = require('chai')
let chai = require('chai')
let chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

describe('geo', () => {
  let geo = geoType({
    geocodeLocation: () => ({
      results: [
        {
          geometry: {
            location: {
              lat: 26.3170479,
              lng: -80.1131784,
            },
          },
        },
      ],
    }),
  })

  it('hasValue should work', () => {
    utils.hasValueContexts(geo)([
      {
        data: {
          location: true,
          radius: true,
          operator: true,
        },
      },
      {
        data: {
          location: true,
          radius: -1,
          operator: true,
        },
      },
      {
        data: {
          location: 'SmartProcure',
          radius: 10,
          operator: 'within',
        },
      },
    ])
    utils.noValueContexts(geo)([
      {
        data: {},
      },
      {
        data: {
          location: false,
          radius: 10,
          operator: 'within',
        },
      },
      {
        data: {
          location: '',
          radius: 10,
          operator: 'within',
        },
      },
      {
        data: {
          radius: 10,
          operator: 'within',
        },
      },
      {
        data: {
          location: true,
          radius: 0,
          operator: 'within',
        },
      },
      {
        data: {
          location: true,
          radius: false,
          operator: 'within',
        },
      },
      {
        data: {
          location: true,
          operator: 'within',
        },
      },
      {
        data: {
          location: true,
          radius: 10,
          operator: false,
        },
      },
      {
        data: {
          location: true,
          radius: 10,
          operator: '',
        },
      },
      {
        data: {
          location: true,
          radius: 10,
        },
      },
    ])
  })

  describe('filter', () => {
    it('should filter properly', () => {
      expect(
        geo.filter({
          type: 'geo',
          field: 'test',
          data: {
            location: 'SmartProcure',
            radius: 10,
            operator: 'within',
          },
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
          data: {
            location: 'SmartProcure',
            radius: 15,
            operator: 'outside',
          },
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
        data: {
          location: true,
          radius: 1,
          operator: true,
        },
      },
      {
        data: {
          location: 'SmartProcure',
          radius: 10,
          operator: 'within',
        },
      },
    ])
    utils.noValidContexts(geo)([
      {
        data: {},
      },
      {
        data: {
          location: false,
          radius: 10,
          operator: 'within',
        },
      },
      {
        data: {
          location: '',
          radius: 10,
          operator: 'within',
        },
      },
      {
        data: {
          radius: 10,
          operator: 'within',
        },
      },
      {
        data: {
          location: true,
          radius: 0,
          operator: 'within',
        },
      },
      {
        data: {
          location: true,
          operator: 'within',
        },
      },
      {
        data: {
          location: true,
          radius: 10,
          operator: false,
        },
      },
      {
        data: {
          location: true,
          radius: 10,
          operator: '',
        },
      },
      {
        data: {
          location: true,
          radius: 10,
        },
      },
    ])
  })

  it('result should work', () => {
    let context = {
      type: 'geo',
      field: 'test',
      data: {
        location: 'SmartProcure',
        radius: 10,
        operator: 'within',
      },
      _meta: {},
    }
    return expect(
      geo.filter(context).then(() => geo.result(context))
    ).to.become({
      place: {
        geometry: {
          location: {
            lat: 26.3170479,
            lng: -80.1131784,
          },
        },
      },
    })
  })
})
