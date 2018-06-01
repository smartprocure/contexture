let _ = require('lodash/fp')
let F = require('futil-js')
let { parens, quote } = F
let Combinatorics = require('js-combinatorics')

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
  if (tag.isPhrase)
    return quote(text) + (tag.distance ? `~${tag.distance}` : '')
  // Single word.
  // Note: ~1 for misspellings allows for the insertion, deletion or substitution of a single character, or transposition of two adjacent characters.
  return text + (tag.misspellings ? '~1' : '')
})

// https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#_reserved_characters
let escapeReservedChars = _.flow(
  _.toString,
  // Escape these characters
  _.replace(/([+\-=&|!(){}[\]^"~*?:\\/])/g, '\\$1'),
  // Remove these characters
  _.replace(/[><]/g, '')
)

let tagToQueryString = tag => {
  let _tag = escapeReservedChars(tag.word)

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

let limitResultsToCertainTags = tags => _.find('onlyShowTheseResults', tags)

let tagsToQueryString = (tags, join) =>
  _.flow(
    F.when(limitResultsToCertainTags, _.filter('onlyShowTheseResults')),
    _.map(tagToQueryString),
    joinTags(join)
  )(tags)

let hasValue = _.get('tags.length')

let filter = context => {
  let query = tagsToQueryString(context.tags, context.join)

  // Drop .untouched
  let field = context.field.replace('.untouched', '')

  // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
  let result = {
    query_string: {
      query,
      default_operator: 'AND',
      default_field: field + (context.exact ? '.exact' : ''),
    },
  }
  if (context.exact) result.query_string.analyzer = 'exact'

  return result
}

module.exports = {
  wordPermutations,
  limitResultsToCertainTags,
  addQuotesAndDistance,
  escapeReservedChars,
  tagToQueryString,
  joinTags,
  tagsToQueryString,
  hasValue,
  filter,
}
