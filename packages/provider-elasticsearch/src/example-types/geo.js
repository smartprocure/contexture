let _ = require('lodash/fp')
let Promise = require('bluebird')

let geo = ({
  geocodeLocation = () => {
    throw new Error('Geo filter was not passed a geocode service')
  },
} = {}) => ({
  hasValue: context =>
    !!(context.location && context.radius && context.operator),
  filter: context =>
    Promise.resolve(geocodeLocation(context.location))
      .then(response => {
        // Check for API key limit/expiration
        if (response.error_message) {
            throw response.error_message
        }

        let geolocation = _.flow(
          _.head,
          _.get('geometry.location'),
          result => result || { lat: 0, lng: 0 }
        )(response.results)

        context._meta.preprocessorResult = response

        let result = {
          geo_distance: {
            [context.field]: `${geolocation.lat},${geolocation.lng}`,
            distance: `${context.radius}mi`,
          },
        }
        if (context.operator !== 'within') {
          result = {
            bool: {
              must_not: result,
            },
          }
        }

        return result
      })
      .catch(err =>
        console.error('An error occured within the geo provider: ', err)
      ),
  validContext: context =>
    !!(context.location && context.radius > 0 && context.operator),
  result: context => ({
    place: _.get('_meta.preprocessorResult.results.0', context),
  }),
})

module.exports = geo
