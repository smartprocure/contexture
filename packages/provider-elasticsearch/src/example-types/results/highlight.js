import _ from 'lodash/fp.js'
import F from 'futil'
import { CartesianProduct } from 'js-combinatorics'
import { groupByIndexed } from '../../utils/futil.js'

/**
 * Set of all fields groups in the mappings, including their cartesian product with
 * sub fields. For example, given the schema
 *
 * {
 *   elasticsearch: {
 *     subFields: {
 *       exact: { shouldHighlight: true }
 *     }
 *   },
 *   fields: {
 *     address: {},
 *     state: {
 *       elasticsearch: {
 *         copy_to: ['address'],
 *         fields: { exact: {} }
 *       }
 *     }
 *   }
 * }
 *
 * this function will return `["address", "address.exact"]`
 *
 * See https://www.elastic.co/guide/en/elasticsearch/reference/current/copy-to.html
 */
const getAllFieldsGroups = _.memoize((schema) => {
  const highlightSubFields = _.keys(
    _.pickBy('shouldHighlight', schema.elasticsearch?.subFields)
  )
  return new Set(
    _.flatMap((field) => {
      const copy_to = field.elasticsearch?.copy_to
      if (!_.isEmpty(copy_to)) {
        const product = new CartesianProduct(copy_to, highlightSubFields)
        return [...copy_to, ...Array.from(product).map(_.join('.'))]
      }
      return copy_to
    }, schema.fields)
  )
}, _.get('elasticsearch.index'))

/**
 * Only fields whose names are present in the query get highlighted by elastic
 * due to us passing `require_field_match:true`. However, we have to consider
 * sub fields as well. For example, if `city` is a multi-field containing a
 * sub-field named `exact`, elastic won't highlight `city` in the following
 * request:
 *
 * {
 *   "query": {
 *     "match": {
 *       "city.exact": { "query": "memphis" }
 *     }
 *   },
 *   "highlight": {
 *     "fields": {
 *       "city": {},
 *     }
 *   }
 * }
 *
 * Instead, we have to match the sub-field verbatim in the highlight config:
 *
 * {
 *   "query": {
 *     "match": {
 *       "city.exact": { "query": "memphis" }
 *     }
 *   },
 *   "highlight": {
 *     "fields": {
 *       "city.exact": {},
 *     }
 *   }
 * }
 *
 * This function will make mappings for subfields so we can spread them at the
 * top-level and send them along with regular fields for elastic to highlight.
 */
const getSubFieldsMappings = (schema, multiFieldMapping, multiFieldName) =>
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

/** Mappings for fields that should be highlighted */
const getHighlightFieldsMappings = _.memoize((schema) => {
  const allFieldsGroups = getAllFieldsGroups(schema)
  return F.reduceIndexed(
    (acc, { elasticsearch: mapping }, name) => {
      if (mapping && !allFieldsGroups.has(name)) {
        Object.assign(acc, {
          [name]: mapping,
          ...getSubFieldsMappings(schema, mapping, name),
        })
      }
      return acc
    },
    {},
    schema.fields
  )
}, _.get('elasticsearch.index'))

export const getHighlightFields = (schema, query) => {
  const allFieldsGroups = getAllFieldsGroups(schema)

  const querystr = JSON.stringify(query)

  // Pre-computed list of fields groups present in the query
  const queryFieldsGroups = []
  F.walk()((val, key) => {
    if (allFieldsGroups.has(val)) queryFieldsGroups.push(val)
    if (allFieldsGroups.has(key)) queryFieldsGroups.push(key)
  })(query)

  /**
   * Only fields whose names are present in the query get highlighted by elastic
   * due to us passing `require_field_match:true`. However, we have to consider
   * fields groups as well. For example, given that `city` and `street` are
   * copied to `address`, elastic won't highlight them in the following request:
   *
   * {
   *   "query": {
   *     "match": {
   *       "address": { "query": "memphis" }
   *     }
   *   },
   *   "highlight": {
   *     "fields": {
   *       "city": {},
   *       "street": {}
   *     }
   *   }
   * }
   *
   * Instead, we have to specify a query just for highlighting, making sure we
   * replace `address` with the correct field:
   *
   * {
   *   "query": {
   *     "match": {
   *       "address": { "query": "memphis" }
   *     }
   *   },
   *   "highlight": {
   *     "fields": {
   *       "city": {
   *         "highlight_query": {
   *           "match": {
   *             "city": { "query": "memphis" }
   *           }
   *         }
   *       },
   *       "street": {
   *         "highlight_query": {
   *           "match": {
   *             "street": { "query": "memphis" }
   *           }
   *         }
   *       }
   *     }
   *   }
   * }
   *
   * Also, an interesting behavior is that boolean logic has no effect in
   * highlighting. The following query will highlight both `memphis` and
   * `miami` in the field `city` even though only the first `should` expression
   * matches.
   *
   * {
   *   "bool": {
   *     "should": [
   *       { "match": { "city": "memphis" } },
   *       {
   *         "bool": {
   *           "must": [
   *             { "match": { "city": "miami" } },
   *             { "match": { "state": "<null>" } }
   *           ]
   *         }
   *       }
   *     ]
   *   }
   * }
   */
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

  return F.mapValuesIndexed(
    fieldMappingToHighlightConfig,
    getHighlightFieldsMappings(schema)
  )
}

/**
 * Returns an array of [start, end] ranges that correspond to substrings
 * enclosed in pre/post tags. The ranges correspond to the plain string without
 * tags. For example given the tags `{ pre: '<em>', post: '</em>' }`, this
 * function will return [[2, 5], [6, 9]] for the string
 *
 * `A <em>red</em> <em>car</em>`
 */
const getHighlightRanges = (tags, str) => {
  let runningTagsLength = 0
  const ranges = []
  const regexp = new RegExp(`${tags.pre}(?<capture>.*?)${tags.post}`, 'g')
  for (const match of str.matchAll(regexp)) {
    const start = match.index - runningTagsLength
    const end = start + match.groups.capture.length
    ranges.push([start, end])
    runningTagsLength += tags.pre.length + tags.post.length
  }
  return ranges
}

/** Wrap substrings given by [start, end] ranges with pre/post tags */
const highlightFromRanges = (tags, str, ranges) => {
  const starts = _.fromPairs(_.map((x) => [x[0]], ranges))
  const ends = _.fromPairs(_.map((x) => [x[1]], ranges))
  const highlighted = str.replace(/./g, (match, index) => {
    if (index in starts) return `${tags.pre}${match}`
    if (index in ends) return `${tags.post}${match}`
    return match
  })
  // Sometimes the last word is highlighted so the index for the last tag is
  // `str.length` but `replace` only makes it up to `str.length - 1`.
  return _.last(_.last(ranges)) === str.length
    ? `${highlighted}${tags.post}`
    : highlighted
}

export const mergeHighlights = (tags, ...strs) => {
  // This may look unnecessary but merging highlights is not cheap and many
  // times is not even needed
  if (_.size(strs) <= 1) return _.head(strs)
  const ranges = F.mergeRanges(
    _.flatMap((str) => getHighlightRanges(tags, str), strs)
  )
  const plain = _.head(strs).replaceAll(tags.pre, '').replaceAll(tags.post, '')
  return highlightFromRanges(tags, plain, ranges)
}

// This function mutates hits for performance reasons
export const inlineHighlightResults = (tags, schema, highlight, hits) => {
  const isSubType = _.curry(
    (subType, field) => field?.elasticsearch?.meta?.subType === subType
  )

  const isSubField = _.curry(
    (subField, field) => !!field?.elasticsearch?.fields?.[subField]
  )

  const arrayFields = _.keys(_.pickBy(isSubType('array'), schema.fields))

  const lastWordRegex = /\.(\w+)$/
  const getFieldKey = (val, key) => {
    const [field, sub] = key.split(lastWordRegex)
    return isSubField(sub, schema.fields[field]) ? field : key
  }

  for (const hit of hits) {
    const highlights = F.reduceIndexed(
      (acc, fragments, field) => {
        const arrayField = _.find((k) => field.startsWith(k), arrayFields)

        if (!arrayField) {
          if (isSubType('blob', schema.fields[field])) {
            acc[field] = fragments
          } else {
            acc[field] = mergeHighlights(tags, ...fragments)
          }
          return acc
        }

        const nestedField = field.slice(arrayField.length).replace('.', '')
        const array = _.get(arrayField, hit._source)

        if (!array) {
          acc[arrayField] = nestedField
            ? _.map((fragment) => _.set(nestedField, fragment, {}), fragments)
            : fragments
        } else {
          const fragmentsMap = _.reduce(
            (acc, fragment) => {
              const plain = fragment
                .replaceAll(tags.pre, '')
                .replaceAll(tags.post, '')
              acc[plain] = fragment
              return acc
            },
            {},
            fragments
          )

          acc[arrayField] = []

          for (let index in array) {
            if (nestedField) {
              const fragment = fragmentsMap[_.get(nestedField, array[index])]
              const item = highlight.filterSourceArrays
                ? undefined
                : _.get(nestedField, array[index])
              acc[arrayField].push(
                _.set(nestedField, fragment ?? item, array[index])
              )
            } else {
              const fragment = fragmentsMap[array[index]]
              const item = highlight.filterSourceArrays
                ? undefined
                : array[index]
              acc[arrayField].push(fragment ?? item)
            }
          }

          if (highlight.filterSourceArrays) {
            acc[arrayField] = _.remove(
              (item) =>
                _.isUndefined(nestedField ? _.get(nestedField, item) : item),
              acc[arrayField]
            )
          }
        }

        return acc
      },
      {},
      _.mapValues(_.flatten, groupByIndexed(getFieldKey, hit.highlight))
    )

    if (highlight.filterSourceArrays) {
      for (const field of arrayFields) {
        highlights[field] ??= []
      }
    }

    for (const [field, val] of _.toPairs(highlights)) {
      F.setOn(field, val, hit._source)
    }
  }
}
