let _ = require('lodash')

module.exports = {
  result: async ({ field }, search) =>
    _.head(
      await search([
        {
          $group: {
            _id: {},
            count: { $sum: 1 },
            max: {
              $max: `$${field}`,
            },
            min: {
              $min: `$${field}`,
            },
            avg: {
              $avg: `$${field}`,
            },
            sum: {
              $sum: `$${field}`,
            },
          },
        },
      ])
    ) || {
      count: 0,
      avg: 0,
      max: 0,
      min: 0,
      sum: 0,
    },
}
