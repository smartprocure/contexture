let _ = require('lodash/fp')
let { negate } = require('../elasticDSL')

let hasValue = ({ location, latitude, longitude, radius, operator }) =>
  !!((location || (latitude && longitude)) && radius && operator)

let geo = ({
  geocodeLocation = () => {
    throw new Error('Geo filter was not passed a geocode service')
  },
} = {}) => ({
  hasValue,
  validContext: hasValue,
  filter: async node => {
    if (node.latitude && node.longitude)
      return {
        Latitude: node.latitude,
        Longitude: node.longitude,
      }
    try {
      let response = await geocodeLocation(node.location)
      node._meta.preprocessorResult = response
      let result = {
        geo_distance: {
          [node.field]: `${response.Latitude},${response.Longitude}`,
          distance: `${node.radius}mi`,
        },
      }
      return node.operator !== 'within' ? negate(result) : result
    } catch(err) { 
        console.error('An error occured within the geo provider: ', err)
    }
  },
  result: _.get('_meta.preprocessorResult'),
})

module.exports = geo
