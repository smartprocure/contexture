import _ from 'lodash/fp.js'
import F from 'futil'
import Combinatorics from 'js-combinatorics'
import { stripLegacySubFields } from '../../utils/fields.js'
import { generationTagInputs } from '../../utils/keywordGenerations.js'

let maxTagCount = 100

// Split text into words and return array of string permutations
let wordPermutations = _.flow(
  _.split(/\s+/),
  (x) => Combinatorics.permutation(x).toArray(),
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

// https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#_reserved_characters
let replaceReservedChars = _.flow(
  _.toString,
  // Replace characters with white space ` `
  _.replace(/([+\-=&|!(){}[\]^"~*?:\\/<>;,$'])/g, ' ')
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
    _.map(tagToQueryString),
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
                (word) => filter({ ...node, tags: [{word}] })
              )(keywordGenerations)
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

  let keywords = node.generateKeywords ? 
    await generateKeywords(generationTagInputs(node.tags)) : []
    
  let aggs = node.generateKeywords ?
    buildResultQuery(
      node,
      {},
      'tags',
      keywords
    ) : buildResultQuery(node)

  return _.flow(
    (results) => ({
      tags: _.get('aggregations.tags.buckets', results),
      keywordGenerations: _.flow(
        _.get('aggregations.keywordGenerations.buckets'),
        _.pickBy('doc_count')
      )(results),
    }),
    _.mapValues(_.mapValues('doc_count'))
  )(await search(aggs))
}

let validContext = (node) => {
  let tagsCount = _.get('tags.length', node)
  return tagsCount && tagsCount <= maxTagCount
}

export default (options) => ({
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
  result: result(options?.generateKeywords || (() => [])),
})
