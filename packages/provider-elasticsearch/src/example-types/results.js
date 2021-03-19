let F = require('futil')
let _ = require('lodash/fp')
let {
  highlightResults,
  arrayToHighlightsFieldMap,
} = require('../utils/highlighting')
let { getField } = require('../utils/fields')

module.exports = {
  validContext: () => true,
  result(node, search, schema) {
    let page = (node.page || 1) - 1
    let pageSize = node.pageSize || 10
    let startRecord = page * pageSize
    let sortField = node.sortField ? getField(schema, node.sortField) : '_score'

    let searchObj = {
      from: startRecord,
      size: pageSize,
      sort: { [sortField]: node.sortDir || 'desc' },
      explain: node.explain,
      // Without this, ES7+ stops counting at 10k instead of returning the actual count
      track_total_hits: true,
    }

    if (node.include || node.exclude)
      searchObj._source = F.compactObject({
        includes: node.include,
        excludes: node.exclude,
      })

    // Global schema highlight configuration
    let schemaHighlight =
      node.highlight !== false && schema.elasticsearch.highlight
    // Specific search highlight override
    let searchHighlight = _.isPlainObject(node.highlight) ? node.highlight : {}
    let resultColumns = node.include

    // Highlighting starts with defaults in the schema first
    if (schemaHighlight) {
      let showOtherMatches = _.getOr(false, 'showOtherMatches', node)
      let schemaInline = _.getOr([], 'inline', schemaHighlight)
      let schemaInlineAliases = _.flow(
        _.getOr({}, 'inlineAliases'),
        _.entries,
        _.filter(([k]) => _.includes(k, node.include)),
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
            : // Only highlight on the fields listed in the node include section and their aliases (if any)
              _.pick(_.concat(node.include, schemaInlineAliases), filtered)
      )(schemaHighlight)

      // Setup the DEFAULT highlight config object with the calculated fields above
      // and merge with the search specific config
      searchObj.highlight = _.merge(
        {
          // The default schema highlighting settings w/o the fields
          pre_tags: ['<b class="search-highlight">'],
          post_tags: ['</b>'],
          require_field_match: false,
          number_of_fragments: 0,
          fields,
        },
        searchHighlight
      )

      // Make sure the search specific overrides are part of the node include.
      // This way they do not have to be added manually. All that is needed is the highlight config
      resultColumns = _.flow(
        _.concat(_.keys(searchHighlight.fields)),
        _.uniq,
        _.compact
      )(node.include)

      // Make sure search returns the resultColumns we want by setting the _.source.includes
      F.setOn('_source.includes', resultColumns, searchObj)
    }

    return search(searchObj).then(results => ({
      scrollId: results._scroll_id,
      // ES 7+ is total.value, ES 6- is hits.total
      totalRecords: F.getOrReturn('value', results.hits.total),
      startRecord: startRecord + 1,
      endRecord: startRecord + results.hits.hits.length,
      results: _.map(hit => {
        let additionalFields
        if (schemaHighlight) {
          let highlightObject = highlightResults(
            schemaHighlight, // The highlight configuration
            hit, // The ES result
            schema.elasticsearch.nestedPath,
            resultColumns // The columns to return
          )
          additionalFields = highlightObject.additionalFields
        }

        // TODO - If nested path, iterate properties on nested path, filtering out nested path results unless mainHighlighted or relevant nested fields have "<b></b>" tags in them
        return {
          additionalFields: schemaHighlight ? additionalFields : [],
          ...hit,
        }
      }, results.hits.hits),
    }))
  },
}
