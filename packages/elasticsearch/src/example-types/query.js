let _ = require('lodash')
let utils = require('../luceneQueryUtils')
let unidecode = require('unidecode')
// luceneValidator = require('lib/luceneValidator/luceneValidator');

module.exports = {
  hasValue: context => _.get(context.data, 'query.length'),
  filter: context => {
    let query = context.data.query
      .replace(/\band\b/gi, 'AND')
      .replace(/\bor\b/gi, 'OR')
      .replace(/\bnot\b/gi, 'NOT')
      .replace(/\\(?!")/g, '\\\\')
      .replace(/\//g, '\\/')

    query = unidecode(query)
    query = utils.luceneQueryProcessor(query)

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
