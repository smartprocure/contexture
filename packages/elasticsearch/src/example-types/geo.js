let _ = require('lodash/fp')
let { negate } = require('../elasticDSL')

let geo = ({
  geocodeLocation = () => {
    throw new Error('Geo filter was not passed a geocode service')
  },
} = {}) => ({
  hasValue: node =>
    !!(
      (node.location || (node.latitude && node.longitude)) &&
      node.radius &&
      node.operator
    ),
  filter: node =>
    Promise.resolve(node)
      .then(context => {
        if (context.latitude && context.longitude) {
          return {
            Latitude: context.latitude,
            Longitude: context.longitude,
          }
        } else {
          return geocodeLocation(context.location)
        }
      })
      .then(response => {
        node._meta.preprocessorResult = response

        let result = {
          geo_distance: {
            [node.field]: `${response.Latitude},${response.Longitude}`,
            distance: `${node.radius}mi`,
          },
        }
        return node.operator !== 'within' ? negate(result) : result
      })
      .catch(err =>
        console.error('An error occured within the geo provider: ', err)
      ),
  validContext: node =>
    !!(
      (node.location || (node.latitude && node.longitude)) &&
      node.radius &&
      node.operator
    ),
  result: node => ({
    Latitude: _.get('_meta.preprocessorResult.latitude', node),
    Longitude: _.get('_meta.preprocessorResult.longitude', node),
  }),
})

module.exports = geo
