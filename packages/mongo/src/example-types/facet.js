let _ = require('lodash')
let Promise = require('bluebird')

module.exports = {
  hasValue: context => _.get(context, 'values.length'),
  filter: context => ({
    [context.field]: {
      [context.mode === 'exclude' ? '$nin' : '$in']: context.values,
    },
  }),
  result: (context, search) =>
    Promise.all([
      search(_.compact([
        {
          $group: {
            _id: `$${context.field}`,
            count: {
              $sum: 1,
            },
          },
        },
        context.size !== 0 && {
          $limit: context.size || 10,
        },
      ])),
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
