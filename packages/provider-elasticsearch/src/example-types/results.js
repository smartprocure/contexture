let F = require('futil-js'),
  _ = require('lodash/fp'),
  highlightResults = require('../highlighting').highlightResults

let sortModeMap = {
  field: '.untouched',
  word: ''
}
let getSortField = context =>
  _.replace('.untouched', '', context.config.sortField) +
  _.getOr('', context.config.sortMode, sortModeMap)
module.exports = {
  result: (context, search, schema) => {
    let page = (context.config.page || 1) - 1,
      pageSize = context.config.pageSize || 10,
      startRecord = page * pageSize,
      sortField = context.config.sortField ? getSortField(context) : '_score',
      sortDir = context.config.sortDir || 'desc',
      result = {
        from: startRecord,
        size: pageSize,
        sort: {
          [sortField]: sortDir
        },
        explain: context.config.explain
      }
    let highlight =
      _.getOr(true, 'config.highlight', context) &&
      schema.elasticsearch.highlight
    if (highlight) {
      let highlightFields = _.flatten(_.values(schema.elasticsearch.highlight))
      F.extendOn(result, {
        highlight: {
          pre_tags: ['<b>'],
          post_tags: ['</b>'],
          require_field_match: false,
          number_of_fragments: 0,
          fields: _.fromPairs(_.map(val => [val, {}], highlightFields))
        }
      })
    }

    return search(result).then(results => ({
      scrollId: results._scroll_id,
      response: {
        totalRecords: results.hits.total,
        startRecord: startRecord + 1,
        endRecord: startRecord + results.hits.hits.length,
        results: _.map(hit => {
          let highlightObject, additionalFields // , mainHighlighted;
          if (highlight) {
            highlightObject = highlightResults(
              schema.elasticsearch.highlight,
              hit,
              schema.elasticsearch.nestedPath
            )
            additionalFields = highlightObject.additionalFields
            // mainHighlighted  = highlightObject.mainHighlighted;
          }

          // TODO - If nested path, iterate properties on nested path, filtering out nested path results unless mainHighlighted or relevant nested fields have b tags in them
          return _.extendAll(
            context.config.verbose ? {hit: hit} : {},
            {
              _id: hit._id,
              additionalFields: highlight ? additionalFields : []
            },
            _.getOr(_.identity, 'elasticsearch.summaryView', schema)(hit)
          )
        }, results.hits.hits)
      }
    }))
  }
}
