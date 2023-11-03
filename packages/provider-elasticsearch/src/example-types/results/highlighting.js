import _ from 'lodash/fp.js'
import F from 'futil'
import { CartesianProduct } from 'js-combinatorics'

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

export const mergeHighlights = _.curry((tags, strs) => {
  // This may look unnecessary but merging highlights is not cheap and many
  // times is not even needed
  if (_.size(strs) <= 1) return _.head(strs)
  const ranges = F.mergeRanges(
    _.flatMap((str) => getHighlightRanges(tags, str), strs)
  )
  const plain = _.head(strs).replaceAll(tags.pre, '').replaceAll(tags.post, '')
  return highlightFromRanges(tags, plain, ranges)
})

// Group sub-fields under their containing multi-fields keys. The only reason
// this is a reduce instead of a groupBy is because we need the keys.
const foo = (schema) => (acc, val, key) => {
  const mappings = getHighlightFieldsMappings(schema)
  const parts = key.split('.')
  const multiFieldName = _.dropRight(1, parts).join('.')
  const subFieldName = _.last(parts)
  // Will group `name` and `name.{subfield}` under `name`
  const name = mappings[multiFieldName]?.fields?.[subFieldName]
    ? multiFieldName
    : key
  acc[name] ??= []
  acc[name].push(val)
  return acc
}

// This function mutates hits for performance reasons
export const inlineHighlightResults = (tags, schema, hits) => {
  for (const hit of hits) {
    const highlightedFields = _.flow(
      _.mapValues(_.head),
      F.reduceIndexed(foo(schema), {}),
      _.mapValues(mergeHighlights(tags))
    )(hit.highlight)
    for (const [key, val] of _.toPairs(highlightedFields)) {
      F.setOn(key, val, hit._source)
    }
  }
}
