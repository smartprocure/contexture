let _ = require('lodash/fp')
let F = require('futil')

module.exports = {
  result: async ({ key_field, value_field }, search) => ({
    terms: _.map(
      F.renameProperty('_id', 'key'),
      await search([
        {
          $group: {
            _id: `$${key_field}`,
            count: { $sum: 1 },
            max: { $max: `$${value_field}` },
            min: { $min: `$${value_field}` },
            avg: { $avg: `$${value_field}` },
            sum: { $sum: `$${value_field}` },
          },
        },
      ])
    ),
  }),
}
