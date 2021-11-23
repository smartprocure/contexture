let _ = require('lodash/fp')
let utils = require('../../utils/luceneQueryUtils')
let { stripLegacySubFields } = require('../../utils/fields')

module.exports = {
  hasValue: _.get('query.length'),
  filter: ({ query, field, exact }) => ({
    query_string: {
      query: utils.luceneQueryProcessor(query),
      default_operator: 'AND',
      default_field: stripLegacySubFields(field) + (exact ? '.exact' : ''),
      ...(exact && { analyzer: 'exact' }),
    },
  }),
}
