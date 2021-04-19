let _ = require('lodash/fp')
let F = require('futil')
let { parens, quote } = F
let Combinatorics = require('js-combinatorics')
let { stripLegacySubFields } = require('../../utils/fields')

let maxTagCount = 100

// Split text into words and return array of string permutations
let wordPermutations = _.flow(
  _.split(/\s+/),
  x => Combinatorics.permutation(x).toArray(),
  _.map(_.join(' '))
)

/*
 * Quote phrases and set edit distance.
 * See: https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#_fuzziness
 */
let addQuotesAndDistance = _.curry((tag, text) => {
  // Multiple words
  if (_.includes(' ', text)) {
    return quote(text) + (tag.distance ? `~${tag.distance}` : '')
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

let tagToQueryString = tag => {
  let _tag = replaceReservedChars(tag.word)

  if (tag.distance === 'unlimited') {
    return parens(_tag.replace(/\s+/g, ' AND '))
  } else if (!tag.distance && tag.anyOrder) {
    return _.flow(
      wordPermutations,
      _.map(addQuotesAndDistance(tag)),
      _.join(' OR '),
      parens
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

let buildResultQuery = node => ({
  aggs: {
    tags: {
      filters: {
        filters: F.arrayToObject(
          _.get('word'),
          tag => filter({ ...node, tags: [tag] }),
          node.tags
        ),
      },
    },
  },
})

let result = async (node, search) => {
  let aggs = buildResultQuery(node)

  return _.flow(
    _.get('aggregations.tags.buckets'),
    _.mapValues(_.get('doc_count')),
    results => ({ results })
  )(await search(aggs))
}

let validContext = node => {
  let tagsCount = _.get('tags.length', node)
  return tagsCount && tagsCount <= maxTagCount
}

module.exports = {
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
  result,
}
