let _ = require('lodash/fp')
let Promise = require('bluebird')

let geo = ({
  geocodeLocation = () => {
    throw new Error('Geo filter was not passed a geocode service')
  },
} = {}) => ({
  hasValue: context =>
    !!((context.location || (context.latitude && context.longitude)) && context.radius && context.operator),
  filter: context =>
    Promise.resolve(context)
      .then(context => {
        if (context.latitude && context.longitude) {
          return {
            Latitude: context.latitude,
            Longitude: context.longitude
          }
        } else {
          return geocodeLocation(context.location)
        }
      }).then(response => {

        context._meta.preprocessorResult = response

        let result = {
          geo_distance: {
            [context.field]: `${response.Latitude},${response.Longitude}`,
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
    !!((context.location || (context.latitude && context.longitude)) && context.radius && context.operator),
  result: context => ({
    Latitude: _.get('_meta.preprocessorResult.latitude', context),
    Longitude: _.get('_meta.preprocessorResult.longitude', context)
  }),
})

module.exports = geo
