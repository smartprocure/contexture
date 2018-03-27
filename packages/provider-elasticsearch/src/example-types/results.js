let F = require('futil-js')
let _ = require('lodash/fp')
let highlightResults = require('../highlighting').highlightResults

let sortModeMap = {
  field: '.untouched',
  word: '',
}
let getSortField = context =>
  _.replace('.untouched', '', context.sortField) +
  _.getOr('', context.sortMode, sortModeMap)
module.exports = {
  result(context, search, schema) {
    let page = (context.page || 1) - 1
    let pageSize = context.pageSize || 10
    let startRecord = page * pageSize
    let sortField = context.sortField ? getSortField(context) : '_score'
    let sortDir = context.sortDir || 'desc'
    let result = {
      from: startRecord,
      size: pageSize,
      sort: {
        [sortField]: sortDir,
      },
      explain: context.explain,
    }

    if (context.forceExclude && _.isArray(schema.forceExclude))
      context.exclude = _.union(schema.forceExclude, context.exclude)

    if (context.include || context.exclude) result._source = {}
    if (context.include) result._source.includes = context.include
    if (context.exclude) result._source.excludes = context.exclude
    let highlight =
      _.getOr(true, 'highlight', context) && schema.elasticsearch.highlight
    if (highlight) {
      let highlightFields = _.flatten(_.values(schema.elasticsearch.highlight))
      F.extendOn(result, {
        highlight: {
          pre_tags: ['<b>'],
          post_tags: ['</b>'],
          require_field_match: false,
          number_of_fragments: 0,
          fields: _.fromPairs(_.map(val => [val, {}], highlightFields)),
        },
      })
    }

    return search(result).then(results => ({
      scrollId: results._scroll_id,
      response: {
        totalRecords: results.hits.total,
        startRecord: startRecord + 1,
        endRecord: startRecord + results.hits.hits.length,
        results: _.map(hit => {
          let highlightObject
          let additionalFields // , mainHighlighted;
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
          return _.extendAll([
            context.verbose ? { hit } : {},
            {
              _id: hit._id,
              additionalFields: highlight ? additionalFields : [],
            },
            _.getOr(_.identity, 'elasticsearch.summaryView', schema)(hit),
          ])
        }, results.hits.hits),
      },
    }))
  },
}
