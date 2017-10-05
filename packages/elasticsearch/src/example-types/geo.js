let _ = require('lodash/fp'),
  Promise = require('bluebird')

let geo = ({
  geocodeLocation = () => {
    throw new Error('Geo filter was not passed a geocode service')
  }
}) => ({
  hasValue: context =>
    !!(context.data.location && context.data.radius && context.data.operator),
  filter: context =>
    Promise.resolve(geocodeLocation(context.data.location))
      .then(response => {
        // Check for API key limit/expiration
        if (response.error_message) throw response.error_message
        let location = response.results[0].geometry.location
        context._meta.preprocessorResult = response

        let result = {
          geo_distance: {
            [context.field]: location.lat + ',' + location.lng,
            distance: context.data.radius + 'mi'
          }
        }
        if (context.data.operator !== 'within') {
          result = {
            bool: {
              must_not: result
            }
          }
        }

        return result
      })
      .catch(err =>
        console.error('An error occured within the geo provider: ', err)
      ),
  validContext: context =>
    !!(
      context.data.location &&
      context.data.radius > 0 &&
      context.data.operator
    ),
  result: context => ({
    place: _.get('_meta.preprocessorResult.results.0', context)
  })
})

module.exports = geo
