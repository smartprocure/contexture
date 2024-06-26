import _ from 'lodash/fp.js'
import F from 'futil'
import { Permutation } from 'js-combinatorics'
import { stripLegacySubFields } from '../../utils/fields.js'
import { sanitizeTagInputs } from 'contexture-util/keywordGenerations.js'
import { queryStringCharacterBlacklist } from 'contexture-util/exampleTypes/tagsQuery.js'
import escapeStringRegexp from 'escape-string-regexp'

let maxTagCount = 100

let compactMapValues = _.flow(_.mapValues, F.compactObject)

// Split text into words and return array of string permutations
let wordPermutations = _.flow(
  _.split(/\s+/),
  (x) => new Permutation(x).toArray(),
  _.map(_.join(' '))
)

/*
 * Quote phrases and set edit distance.
 * See: https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#_fuzziness
 */
let addQuotesAndDistance = _.curry((tag, text) => {
  // Multiple words
  if (_.includes(' ', text)) {
    return F.quote(text) + (tag.distance ? `~${tag.distance}` : '')
  }
  // Single word.
  // Note: ~1 for misspellings allows for the insertion, deletion or substitution of a single character, or transposition of two adjacent characters.
  return text + (tag.misspellings ? '~1' : '')
})

let replaceRegexp = new RegExp(
  `[${escapeStringRegexp(queryStringCharacterBlacklist)}]`,
  'g'
)

let replaceReservedChars = _.flow(
  _.toString,
  _.replace(replaceRegexp, ' '),
  // These characters are not stripped out by our analyzers but they are
  // `query_string` reserved characters so we need to escape them.
  _.replace(/([&+\-=:/])/g, '\\$1')
)

let tagToQueryString = (tag) => {
  let _tag = replaceReservedChars(tag.word)

  if (tag.distance === 'unlimited') {
    return F.parens(_tag.replace(/\s+/g, ' AND '))
  } else if (!tag.distance && tag.anyOrder) {
    return _.flow(
      wordPermutations,
      _.map(addQuotesAndDistance(tag)),
      _.join(' OR '),
      F.parens
    )(_tag)
  } else {
    return addQuotesAndDistance(tag, _tag)
  }
}

let joinTags = _.curry((join, tags) => {
  if (!tags.length) return ''

  let separator = { all: ' AND ', any: ' OR ' }[join] || ' OR '
  let joinedTags = tags.join(separator)

  if (join === 'none') return `NOT (${joinedTags})`
  return joinedTags
})

let limitResultsToCertainTags = _.find('onlyShowTheseResults')

let tagsToQueryString = (tags, join) =>
  _.flow(
    F.when(limitResultsToCertainTags, _.filter('onlyShowTheseResults')),
    F.compactMap(tagToQueryString),
    joinTags(join)
  )(tags)

let hasValue = _.get('tags.length')

let filter = ({ tags, join, field, exact }) => ({
  query_string: {
    query: tagsToQueryString(tags, join),
    default_operator: 'AND',
    default_field: stripLegacySubFields(field) + (exact ? '.exact' : ''),
    ...(exact && { analyzer: 'exact' }),
  },
})

let buildResultQuery = (
  node,
  children = {},
  groupsKey = 'tags',
  keywordGenerations = []
) => ({
  aggs: {
    [groupsKey]: {
      filters: {
        filters: F.arrayToObject(
          _.get('word'),
          (tag) => filter({ ...node, tags: [tag] }),
          node.tags
        ),
      },
      ...children,
    },
    ...(keywordGenerations.length > 0 && {
      keywordGenerations: {
        filters: {
          filters: F.compactObject(
            F.keysToObject(
              (word) => filter({ ...node, tags: [{ word }] }),
              _.map(_.toLower, keywordGenerations)
            )
          ),
        },
        aggs: {
          keyword_generation_sort: {
            bucket_sort: {
              sort: [{ _count: { order: 'desc' } }],
            },
          },
        },
      },
    }),
  },
})

let result = (generateKeywords) => async (node, search) => {
  // Passing defaults in case of keywordGenerations, as async is not supported
  let aggs = buildResultQuery(
    node,
    {},
    'tags',
    await F.maybeCall(
      node.generateKeywords && generateKeywords,
      sanitizeTagInputs(node.tags)
    )
  )

  let result = await search(aggs)

  return {
    tags: _.mapValues('doc_count', result.aggregations.tags.buckets),
    ...(result.aggregations.keywordGenerations && {
      keywordGenerations: compactMapValues(
        'doc_count',
        result.aggregations.keywordGenerations.buckets
      ),
    }),
  }
}

let validContext = (node) => {
  let tagsCount = _.get('tags.length', node)
  return tagsCount && tagsCount <= maxTagCount
}

export default ({ generateKeywords } = {}) => ({
  wordPermutations,
  limitResultsToCertainTags,
  addQuotesAndDistance,
  replaceReservedChars,
  tagToQueryString,
  joinTags,
  tagsToQueryString,
  hasValue,
  filter,
  validContext,
  buildResultQuery,
  result: result(generateKeywords),
})
