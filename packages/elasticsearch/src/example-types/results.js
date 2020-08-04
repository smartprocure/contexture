let F = require('futil')
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
    // The default schema highlighting settings w/o the fields
    let defaultHighlightingConfig = {
      pre_tags: ['<b class="search-highlight">'],
      post_tags: ['</b>'],
      require_field_match: false,
      number_of_fragments: 0,
    }
    let searchObj = {
      from: startRecord,
      size: pageSize,
      sort: {
        [sortField]: sortDir,
      },
      explain: context.explain,
      track_total_hits: true
    }

    if (context.forceExclude && _.isArray(schema.forceExclude))
      context.exclude = _.union(schema.forceExclude, context.exclude)
    if (context.include || context.exclude) searchObj._source = {}
    if (context.include) searchObj._source.includes = context.include
    if (context.exclude) searchObj._source.excludes = context.exclude

    // Global schema highlight configuration
    let schemaHighlight =
      _.getOr(true, 'highlight', context) && schema.elasticsearch.highlight
    // Specific search highlight override
    let searchHighlight = _.isPlainObject(context.highlight)
      ? context.highlight
      : {}
    let resultColumns = context.include

    // Highlighting starts with defaults in the schema first
    if (schemaHighlight) {
      let showOtherMatches = _.getOr(false, 'showOtherMatches', context)
      let schemaInline = _.getOr([], 'inline', schemaHighlight)
      let schemaInlineAliases = _.flow(
        _.getOr({}, 'inlineAliases'),
        _.entries,
        _.filter(([k]) => _.includes(k, context.include)),
        _.flatten
      )(schemaHighlight)

      // Concat the search specific override fields with the schema `inline` so we have them as targets for highlight replacement
      schemaHighlight = _.set(
        'inline',
        _.concat(schemaInline, _.keys(searchHighlight.fields)),
        schemaHighlight
      )
      // Convert the highlight fields from array to an object map
      let fields = _.flow(
        _.pick(['inline', 'additionalFields']), // Get the highlight fields we will be working with
        _.values,
        _.flatten,
        _.concat(schemaInlineAliases), // Include the provided field aliases if any
        _.uniq,
        arrayToHighlightsFieldMap, // Convert the array to object map so we can simply _.pick again
        filtered =>
          showOtherMatches
            ? // Highlight on all fields specified in the initial _.pick above.
              filtered
            : // Only highlight on the fields listed in the context include section and their aliases (if any)
              _.pick(_.concat(context.include, schemaInlineAliases), filtered)
      )(schemaHighlight)

      // Setup the DEFAULT highlight config object with the calculated fields above
      // and merge with the search specific config
      F.extendOn(
        searchObj,
        _.merge(
          {
            highlight: { ...defaultHighlightingConfig, fields },
          },
          {
            highlight: searchHighlight,
          }
        )
      )

      // Make sure the search specific overrides are part of the context include.
      // This way they do not have to be added manually. All that is needed is the highlight config
      resultColumns = _.flow(
        _.concat(_.keys(searchHighlight.fields)),
        _.uniq,
        _.compact
      )(context.include)

      // Make sure search returns the resultColumns we want by setting the _.source.includes
      F.setOn('_source.includes', resultColumns, searchObj)
    }

    return search(searchObj).then(results => ({
      scrollId: results._scroll_id,
      response: {
        // ES 7+ is total.value, ES 6- is hits.total
        totalRecords: F.getOrReturn('value', results.hits.total),
        startRecord: startRecord + 1,
        endRecord: startRecord + results.hits.hits.length,
        results: _.map(hit => {
          let highlightObject
          let additionalFields
          if (schemaHighlight) {
            highlightObject = highlightResults(
              schemaHighlight, // The highlight configuration
              hit, // The ES result
              schema.elasticsearch.nestedPath,
              resultColumns // The columns to return
            )
            additionalFields = highlightObject.additionalFields
          }

          // TODO - If nested path, iterate properties on nested path, filtering out nested path results unless mainHighlighted or relevant nested fields have "<b></b>" tags in them
          return _.extendAll([
            context.verbose || _.size(context.include) > 0 ? { hit } : {},
            {
              _id: hit._id,
              _score: hit._score,
              additionalFields: schemaHighlight ? additionalFields : [],
            },
            _.getOr(_.identity, 'elasticsearch.summaryView', schema)(hit),
          ])
        }, results.hits.hits),
      },
    }))
  },
}
