// https://stackoverflow.com/questions/70177601/does-elasticsearch-provide-highlighting-on-copy-to-field-in-their-newer-versio
// https://github.com/elastic/elasticsearch/issues/5172

import _ from 'lodash/fp.js'
import F from 'futil'

export const inlineSubFieldsMappings = _.curry((subFields, mappings) =>
  F.reduceIndexed(
    (mappings, fieldMapping, fieldName) => {
      for (const k in fieldMapping.fields) {
        if (subFields[k]?.shouldHighlight) {
          mappings[`${fieldName}.${k}`] = {
            ...fieldMapping.fields[k],
            meta: { ...fieldMapping.meta, isSubField: true },
            copy_to: _.map((f) => `${f}.${k}`, fieldMapping.copy_to),
          }
        }
      }
      return mappings
    },
    mappings,
    mappings
  )
)

export const makeHighlightConfig = _.curry((query, fieldMapping, fieldName) => {
  const config = {}
  if (fieldMapping.meta?.subType === 'blob') {
    config.order = 'score'
    config.fragment_size = 250
    config.number_of_fragments = 3
  }
  if (!_.isEmpty(fieldMapping.copy_to)) {
    // An improvement would be to only set highlight_query when a field group
    // field is present in the query.
    const queryHasFieldGroup = F.findNode()(
      (val) => _.includes(val, fieldMapping.copy_to),
      query
    )
    if (queryHasFieldGroup) {
      config.highlight_query = F.mapTree()((val) => {
        if (_.includes(val, fieldMapping.copy_to)) {
          val = fieldName
        }
        if (_.isPlainObject(val)) {
          for (const copy_to of fieldMapping.copy_to) {
            F.renamePropertyOn(copy_to, fieldName, val)
          }
        }
        return val
      }, query)
    }
  }
  return config
})

export const mergeHighlightResults = _.curry(() => [])

export const inlineHighlightResults = _.curry(() => [])
