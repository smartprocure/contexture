import _ from 'lodash/fp.js'
import F from 'futil'
import { CartesianProduct } from 'js-combinatorics'

export const getHighlightFields = (query, schema) => {
  const querystr = JSON.stringify(query)

  const highlightSubFields = _.keys(
    _.pickBy('shouldHighlight', schema.elasticsearch?.subFields)
  )

  // Set of all fields groups in the mappings, including their cartesian product with
  // sub fields. For example, given the schema
  //
  // {
  //   elasticsearch: {
  //     subFields: {
  //       exact: { shouldHighlight: true }
  //     }
  //   },
  //   fields: {
  //     address: {},
  //     state: {
  //       elasticsearch: {
  //         copy_to: ['address'],
  //         fields: { exact: {} }
  //       }
  //     }
  //   }
  // }
  //
  // this function will return `["address", "address.exact"]`
  //
  // See https://www.elastic.co/guide/en/elasticsearch/reference/current/copy-to.html
  const allFieldsGroups = new Set(
    _.flatMap((field) => {
      const copy_to = field.elasticsearch?.copy_to
      if (!_.isEmpty(copy_to)) {
        const product = new CartesianProduct(copy_to, highlightSubFields)
        return [...copy_to, ...Array.from(product).map(_.join('.'))]
      }
      return copy_to
    }, schema.fields)
  )

  // Pre-computed list of fields groups present in the query
  const queryFieldsGroups = []
  F.walk()((val, key) => {
    if (allFieldsGroups.has(val)) queryFieldsGroups.push(val)
    if (allFieldsGroups.has(key)) queryFieldsGroups.push(key)
  })(query)

  // Only fields whose names are present in the query get highlighted by elastic
  // due to us passing `require_field_match:true`. However, we have to consider
  // fields groups as well. For example, given that `city` and `street` are
  // copied to `address`, elastic won't highlight them in the following request:
  //
  // {
  //   "query": {
  //     "match": {
  //       "address": { "query": "memphis" }
  //     }
  //   },
  //   "highlight": {
  //     "fields": {
  //       "city": {},
  //       "street": {}
  //     }
  //   }
  // }
  //
  // Instead, we have to specify a query just for highlighting, making sure we
  // replace `address` with the correct field:
  //
  // {
  //   "query": {
  //     "match": {
  //       "address": { "query": "memphis" }
  //     }
  //   },
  //   "highlight": {
  //     "fields": {
  //       "city": {
  //         "highlight_query": {
  //           "match": {
  //             "city": { "query": "memphis" }
  //           }
  //         }
  //       },
  //       "street": {
  //         "highlight_query": {
  //           "match": {
  //             "street": { "query": "memphis" }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  //
  // This function replaces fields groups in the query with the name of the field
  // to highlight.
  const getHighlightQuery = (mapping, name) => {
    const toReplace = _.intersection(queryFieldsGroups, mapping.copy_to)
    if (!_.isEmpty(toReplace)) {
      const regexp = new RegExp(_.join('|', toReplace), 'g')
      return JSON.parse(_.replace(regexp, name, querystr))
    }
  }

  // Transform a field mapping to a field highlighting configuration
  // See https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html#override-global-settings
  const fieldMappingToHighlightConfig = (mapping, name) => {
    const isBlob = mapping.meta?.subType === 'blob'
    return F.omitBlank({
      fragment_size: isBlob ? 250 : null,
      number_of_fragments: isBlob ? 3 : null,
      highlight_query: getHighlightQuery(mapping, name),
    })
  }

  // Only fields whose names are present in the query get highlighted by elastic
  // due to us passing `require_field_match:true`. However, we have to consider
  // sub fields as well. For example, if `city` is a multi-field containing a
  // sub-field named `exact`, elastic won't highlight `city` in the following
  // request:
  //
  // {
  //   "query": {
  //     "match": {
  //       "city.exact": { "query": "memphis" }
  //     }
  //   },
  //   "highlight": {
  //     "fields": {
  //       "city": {},
  //     }
  //   }
  // }
  //
  // Instead, we have to match the sub-field verbatim in the highlight config:
  //
  // {
  //   "query": {
  //     "match": {
  //       "city.exact": { "query": "memphis" }
  //     }
  //   },
  //   "highlight": {
  //     "fields": {
  //       "city.exact": {},
  //     }
  //   }
  // }
  //
  // This function will make mappings for subfields so we can spread them at the
  // top-level and send them along with regular fields for elastic to highlight.
  const getSubFieldsMappings = (multiFieldMapping, multiFieldName) =>
    F.reduceIndexed(
      (acc, mapping, name) => {
        if (schema.elasticsearch.subFields[name]?.shouldHighlight) {
          acc[`${multiFieldName}.${name}`] = {
            ...mapping,
            meta: { ...multiFieldMapping.meta, isSubField: true },
            copy_to: _.map((k) => `${k}.${name}`, multiFieldMapping.copy_to),
          }
        }
        return acc
      },
      {},
      multiFieldMapping.fields
    )

  // Mappings for fields that should be highlighted
  const highlightFieldsMappings = F.reduceIndexed(
    (acc, { elasticsearch: mapping }, name) => {
      if (mapping && !allFieldsGroups.has(name)) {
        Object.assign(acc, {
          [name]: mapping,
          ...getSubFieldsMappings(mapping, name),
        })
      }
      return acc
    },
    {},
    schema.fields
  )

  return F.mapValuesIndexed(
    fieldMappingToHighlightConfig,
    highlightFieldsMappings
  )
}
