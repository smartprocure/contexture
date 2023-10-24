import F from 'futil'
import _ from 'lodash/fp.js'
import { highlightResults, getHighlightSettings } from './highlighting.js'
import { getField } from '../../utils/fields.js'

export default {
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

    let resultColumns = node.include

    let { schemaHighlight, nodeHighlight, subFields } = getHighlightSettings(schema, node)

    if (nodeHighlight) {
      // Setup the DEFAULT highlight config object with the calculated fields above
      // and merge with the search specific config
      searchObj.highlight = nodeHighlight


      // Make sure the search specific overrides are part of the node include.
      // This way they do not have to be added manually. All that is needed is the highlight config
      resultColumns = _.flow(
        _.concat(_.keys((node.highlight ?? {}).fields)),
        _.uniq,
        _.compact
      )(node.include)

      // Make sure search returns the resultColumns we want by setting the _.source.includes
      F.setOn('_source.includes', resultColumns, searchObj)
    }

    return search(searchObj).then((results) => ({
      scrollId: results._scroll_id,
      // ES 7+ is total.value, ES 6- is hits.total
      totalRecords: F.getOrReturn('value', results.hits.total),
      startRecord: startRecord + 1,
      endRecord: startRecord + results.hits.hits.length,
      results: _.map((hit) => {
        let additionalFields
        if (schemaHighlight) {
          let highlightObject = highlightResults({
            schemaHighlight, // The schema highlight configuration
            nodeHighlight, // The result node's highlight configuration
            hit, // The ES result
            include: resultColumns, // The columns to return
            subFields, // The subfields to return
          })
          additionalFields = highlightObject.additionalFields
        }

        // TODO - If nested path, iterate properties on nested path, filtering
        // out nested path results unless mainHighlighted or relevant nested
        // fields have "<b></b>" tags in them
        return {
          additionalFields: schemaHighlight ? additionalFields : [],
          ...hit,
        }
      }, results.hits.hits),
    }))
  },
}