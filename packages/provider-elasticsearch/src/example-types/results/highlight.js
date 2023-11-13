import _ from 'lodash/fp.js'
import F from 'futil'
import { CartesianProduct } from 'js-combinatorics'
import { groupByIndexed, setOrReturn } from '../../utils/futil.js'

/**
 * Set of all fields groups in the mappings, including their cartesian product with
 * sub fields. For example, given the schema
 *
 * {
 *   elasticsearch: {
 *     subFields: {
 *       exact: { highlight: true }
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
    _.pickBy('highlight', schema.elasticsearch?.subFields)
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
      if (schema.elasticsearch.subFields[name]?.highlight) {
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
const getHighlightRanges = (pre, post, str) => {
  let runningTagsLength = 0
  const ranges = []
  const regexp = new RegExp(`${pre}(?<capture>.*?)${post}`, 'g')
  for (const match of str.matchAll(regexp)) {
    const start = match.index - runningTagsLength
    const end = start + match.groups.capture.length
    ranges.push([start, end])
    runningTagsLength += pre.length + post.length
  }
  return ranges
}

/** Wrap substrings given by [start, end] ranges with pre/post tags */
const highlightFromRanges = (pre, post, str, ranges) => {
  const starts = _.fromPairs(_.map((x) => [x[0]], ranges))
  const ends = _.fromPairs(_.map((x) => [x[1]], ranges))
  const highlighted = str.replace(/./g, (match, index) => {
    if (index in starts) return `${pre}${match}`
    if (index in ends) return `${post}${match}`
    return match
  })
  // Sometimes the last word is highlighted so the index for the last tag is
  // `str.length` but `replace` only makes it up to `str.length - 1`.
  return _.last(_.last(ranges)) === str.length
    ? `${highlighted}${post}`
    : highlighted
}

export const mergeHighlights = (pre, post, ...strs) => {
  // This may look unnecessary but merging highlights is not cheap and many
  // times is not even needed
  if (_.size(strs) <= 1) return _.head(strs)
  const ranges = F.mergeRanges(
    _.flatMap((str) => getHighlightRanges(pre, post, str), strs)
  )
  const plain = _.head(strs).replaceAll(pre, '').replaceAll(post, '')
  return highlightFromRanges(pre, post, plain, ranges)
}

const stripTags = _.curry((pre, post, fragment) =>
  fragment.replaceAll(pre, '').replaceAll(post, '')
)

// Merge highlighted fragments onto a source array
export const highlightArray = (array, fragments, config) => {
  if (_.isEmpty(array)) {
    return _.map(
      (fragment) => setOrReturn(config.fragmentPath, fragment, {}),
      fragments
    )
  }
  const fragmentsMap = F.arrayToObject(
    stripTags(config.pre_tag, config.post_tag),
    _.identity,
    fragments
  )
  return _.reduce(
    (acc, item) => {
      const plain = F.getOrReturn(config.fragmentPath, item)
      const fragment = fragmentsMap[plain]
      return config.filterSourceArrays && fragment === undefined
        ? acc
        : F.push(setOrReturn(config.fragmentPath, fragment ?? plain, item), acc)
    },
    [],
    array
  )
}

// Best-effort naming on this function :/
export const alignHighlightsWithSourceStructure = (schema, highlightConfig) => {
  const arrayFields = _.pickBy(
    { elasticsearch: { meta: { subType: 'array' } } },
    schema.fields
  )
  const emptyArrayFields = _.mapValues(_.constant([]), arrayFields)
  const arrayFieldsNames = _.keys(arrayFields)
  const getArrayFieldName = (field) =>
    _.find((k) => field.startsWith(k), arrayFieldsNames)

  const lastWordRegex = /\.(\w+)$/
  // Ex: `title` and `title.exact` both result in `title`
  const getMultiFieldName = (field) => {
    const [multi, sub] = field.split(lastWordRegex)
    return schema.fields[multi]?.elasticsearch?.fields?.[sub] ? multi : field
  }

  // Merge highlighted fragments onto a source array
  const getHighlightedArray = (fragments, field, source) => {
    const arrayPath = getArrayFieldName(field)
    return highlightArray(_.get(arrayPath, source), fragments, {
      ...highlightConfig,
      fragmentPath: field.slice(arrayPath.length + 1), // +1 strips off leading dot
    })
  }

  // Transform highlighted fragments into something that can be used to replace
  // source values
  const handleHighlightedFragments = (hit) => (fragments, field) =>
    getArrayFieldName(field)
      ? getHighlightedArray(fragments, field, hit._source)
      : // Do not do anything with fragments for text blobs
      schema.fields[field]?.elasticsearch?.meta?.subType === 'blob'
      ? fragments
      : // Assumming we sent `number_of_fragments:0` to elastic, there should be
        // at most one fragment per multi-field (ex: `title`) and at most one
        // fragment for each sub-field (ex: `title.exact`, `title.keyword`).
        mergeHighlights(
          highlightConfig.pre_tag,
          highlightConfig.post_tag,
          ...fragments
        )

  return (hit) =>
    _.flow(
      // Group `city` and `city.exact` under `city`
      groupByIndexed((v, k) => getMultiFieldName(k)),
      _.mapValues(_.flatten),
      F.mapValuesIndexed(handleHighlightedFragments(hit)),
      // Rename `streets.name` to `streets` if `streets` is an array field so
      // that we can simply replace arrays wholesale in the source.
      _.mapKeys((field) => getArrayFieldName(field) ?? field),
      // Default to empty arrays if source arrays should be filtered but no
      // highlights come back for them.
      _.defaults(highlightConfig.filterSourceArrays ? emptyArrayFields : {})
    )(hit.highlight)
}
