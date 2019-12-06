let F = require('futil-js')
let _ = require('lodash/fp')
let { highlightResults, arrayToHighlightsFieldMap } = require('../highlighting')
let { getField } = require('../fields')

module.exports = {
  result(context, search, schema) {
    let page = (context.page || 1) - 1
    let pageSize = context.pageSize || 10
    let startRecord = page * pageSize
    let sortField = context.sortField
      ? // default to word (aka '') for backwards compatibility
        getField(schema, context.sortField, context.sortMode || 'word')
      : '_score'
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
    let inlineAliases = _.getOr({}, 'inlineAliases', highlight)
    let showOtherMatches = _.getOr(false, 'showOtherMatches', context)

    if (highlight) {
      // Convert the highlight fields from array to an object map
      let fields = _.flow(
        _.pick(['inline', 'additionalFields']),
        _.values,
        _.flatten,
        _.concat(_.values(inlineAliases)),
        _.uniq(),
        arrayToHighlightsFieldMap,
        filtered => showOtherMatches
          ? filtered
          : _.pick(_.intersection(context.include, _.keys(filtered)), filtered),
      )(highlight)

      F.extendOn(result, {
        highlight: {
          pre_tags: ['<b class="search-highlight">'],
          post_tags: ['</b>'],
          require_field_match: false,
          number_of_fragments: 0,
          fields
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
          let additionalFields
          if (highlight) {
            highlightObject = highlightResults(
              schema.elasticsearch.highlight,
              hit,
              schema.elasticsearch.nestedPath,
              context.include
            )
            additionalFields = highlightObject.additionalFields
          }

          // TODO - If nested path, iterate properties on nested path, filtering out nested path results unless mainHighlighted or relevant nested fields have b tags in them
          return _.extendAll([
            context.verbose || _.size(context.include) > 0 ? { hit } : {},
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
