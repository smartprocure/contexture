let _ = require('lodash/fp')
let utils = require('../../utils/luceneQueryUtils')

module.exports = {
  hasValue: _.get('query.length'),
  filter: ({ query, field, exact }) => ({
    query_string: {
      query: utils.luceneQueryProcessor(query),
      default_operator: 'AND',
      default_field: field.replace('.untouched', '') + (exact ? '.exact' : ''),
      ...(exact && { analyzer: 'exact' }),
    },
  }),
}
