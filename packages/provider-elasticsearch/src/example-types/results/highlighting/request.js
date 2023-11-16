import _ from 'lodash/fp.js'
import F from 'futil'
import { CartesianProduct } from 'js-combinatorics'

/**
 * Return names for all fields groups and their sub-fields in `schema`.
 */
const getFieldsGroupsNames = _.memoize((schema) => {
  const subFields = _.keys(
    _.pickBy('highlight', schema.elasticsearch?.subFields)
  )

  const fields = _.flatMap((field) => {
    const copy_to = field.elasticsearch?.copy_to
    if (!_.isEmpty(copy_to)) {
      const product = new CartesianProduct(copy_to, subFields)
      return [...copy_to, ...Array.from(product).map(_.join('.'))]
    }
    return copy_to
  }, schema.fields)

  return new Set(fields)
}, _.get('elasticsearch.index'))

/**
 * Return mappings for all sub-fields that can be highlighted in `mapping`.
 */
const getSubFieldsMappings = (schema, mapping) =>
  F.reduceIndexed(
    (acc, sfMapping, sfName) => {
      if (schema.elasticsearch.subFields?.[sfName]?.highlight) {
        acc[sfName] = {
          ...sfMapping,
          meta: mapping.meta,
          copy_to: _.map((k) => `${k}.${sfName}`, mapping.copy_to),
        }
      }
      return acc
    },
    {},
    mapping.fields
  )

/**
 * Return mappings for all fields and their sub-fields that can be highlighted
 * in `schema`.
 */
const getFieldsMappings = _.memoize((schema) => {
  const fieldsGroups = getFieldsGroupsNames(schema)
  return F.reduceIndexed(
    (acc, { elasticsearch: mapping }, name) => {
      // Only include leaf fields (have mapping) and do not include fields
      // groups.
      if (mapping && !fieldsGroups.has(name)) {
        Object.assign(acc, {
          [name]: mapping,
          ..._.mapKeys(
            (k) => `${name}.${k}`,
            getSubFieldsMappings(schema, mapping)
          ),
        })
      }
      return acc
    },
    {},
    schema.fields
  )
}, _.get('elasticsearch.index'))

export const getRequestBodyHighlight = (schema, node, config) => {
  const query = node._meta?.relevantFilters
  const querystr = JSON.stringify(query)
  const allFieldsGroups = getFieldsGroupsNames(schema)

  // Pre-computed list of fields groups present in the query
  const queryFieldsGroups = []
  F.walk()((val, key) => {
    if (allFieldsGroups.has(val)) queryFieldsGroups.push(val)
    if (allFieldsGroups.has(key)) queryFieldsGroups.push(key)
  })(query)

  const getHighlightQuery = (mapping, name) => {
    const toReplace = _.intersection(queryFieldsGroups, mapping.copy_to)
    if (!_.isEmpty(toReplace)) {
      const regexp = new RegExp(_.join('|', toReplace), 'g')
      return JSON.parse(_.replace(regexp, name, querystr))
    }
  }

  const mappingToHighlightConfig = (mapping, name) => {
    const isBlob = mapping.meta?.subType === 'blob'
    return F.omitBlank({
      fragment_size: isBlob ? 250 : null,
      number_of_fragments: isBlob ? 3 : null,
      highlight_query: getHighlightQuery(mapping, name),
    })
  }

  return {
    pre_tags: [config.pre_tag],
    post_tags: [config.post_tag],
    number_of_fragments: 0,
    fields: F.mapValuesIndexed(
      mappingToHighlightConfig,
      getFieldsMappings(schema)
    ),
  }
}
