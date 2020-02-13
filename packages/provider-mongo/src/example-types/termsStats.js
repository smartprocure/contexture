let _ = require('lodash/fp')
let F = require('futil')
let { statsAgg } = require('./statistical')

module.exports = {
  result: async ({ key_field, value_field }, search) => ({
    terms: _.map(
      F.renameProperty('_id', 'key'),
      await search([statsAgg(value_field, key_field)])
    ),
  }),
}
