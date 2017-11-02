let _ = require('lodash/fp')
let utils = require('../luceneQueryUtils')
// luceneValidator = require('lib/luceneValidator/luceneValidator');

module.exports = {
  hasValue: _.get('data.query.length'),
  filter: context => {
    let query = utils.luceneQueryProcessor(context.data.query)

    // let luceneValidation = luceneValidator.doCheckLuceneQueryValue(query);
    // if (!_.isEmpty(luceneValidation))
    //     throw luceneValidation;

    // Drop .untouched
    let field = context.field.replace('.untouched', '')

    let result = {
      query_string: {
        query: query,
        default_operator: 'AND',
        default_field: field + (context.data.exact ? '.exact' : '') || '_all',
      },
    }
    if (context.data.exact) result.query_string.analyzer = 'exact'

    return result
  },
}
