let _ = require('lodash')
let Promise = require('bluebird')

module.exports = {
  hasValue: context => _.get(context.data, 'values.length'),
  filter: context => ({
    [context.field]: {
      [context.data.mode === 'exclude' ? '$nin' : '$in']: context.data.values,
    },
  }),
  result: (context, search) =>
    Promise.all([
      search([
        {
          $group: {
            _id: `$${context.field}`,
            count: {
              $sum: 1,
            },
          },
        },
        {
          $limit: context.config.size || 10,
        },
      ]),
      search([
        {
          $group: {
            _id: `$${context.field}`,
          },
        },
        {
          $group: {
            _id: 1,
            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]).spread((options, cardinality) => ({
      total: 'NOT SUPPORTED YET',
      cardinality: _.get(cardinality, '0.count'),
      options: _.map(options, x => ({
        name: x._id,
        count: x.count,
      })),
    })),
}
