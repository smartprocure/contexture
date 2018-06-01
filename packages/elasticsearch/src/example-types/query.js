let _ = require('lodash/fp')
let utils = require('../luceneQueryUtils')
// luceneValidator = require('lib/luceneValidator/luceneValidator');

module.exports = {
  hasValue: _.get('query.length'),
  filter(context) {
    let query = utils.luceneQueryProcessor(context.query)

    // let luceneValidation = luceneValidator.doCheckLuceneQueryValue(query);
    // if (!_.isEmpty(luceneValidation))
    //     throw luceneValidation;

    // Drop .untouched
    let field = context.field.replace('.untouched', '')

    // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
    let result = {
      query_string: {
        query,
        default_operator: 'AND',
        default_field: field + (context.exact ? '.exact' : ''),
      },
    }
    if (context.exact) result.query_string.analyzer = 'exact'

    return result
  },
}
