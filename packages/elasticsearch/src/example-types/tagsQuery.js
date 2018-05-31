let _ = require('lodash/fp')
let { parens, quote } = require('futil-js')
let Combinatorics = require('js-combinatorics')

// Split text into words and return array of string permutations
let wordPermutations = _.flow(
  _.split(/\s+/),
  x => Combinatorics.permutation(x).toArray(),
  _.map(_.join(' '))
)

let quoteAndTilde = _.curry(
  (tag, text) =>
    (tag.isPhrase ? quote(text) : text) +
    (tag.misspellings || tag.distance ? '~' : '') +
    (tag.distance || '')
)

// https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#_reserved_characters
let escapeReservedChars = text =>
  text.toString().replace(/([+\-=&|><!(){}[\]^"~*?:\\/])/g, '\\$1')

let tagToQueryString = tag => {
  let _tag = escapeReservedChars(tag.word)

  if (tag.distance === 'unlimited') {
    return parens(_tag.replace(/\s+/g, ' AND '))
  } else if (!tag.distance && tag.anyOrder) {
    return _.flow(
      wordPermutations,
      _.map(quoteAndTilde(tag)),
      _.join(' OR '),
      parens
    )(_tag)
  } else {
    return quoteAndTilde(tag, _tag)
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

let tagsToQueryString = (tags, join) => {
  let shouldLimitToCertainWords = limitResultsToCertainTags(tags)
  return _.flow(
    _.filter(
      tag =>
        shouldLimitToCertainWords ? _.get('onlyShowTheseResults', tag) : true
    ),
    _.map(tagToQueryString),
    joinTags(join)
  )(tags)
}

let hasValue = _.get('tags.length')

let filter = context => {
  let query = tagsToQueryString(context.tags, context.join)

  // Drop .untouched
  let field = context.field.replace('.untouched', '')

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
  quoteAndTilde,
  escapeReservedChars,
  tagToQueryString,
  joinTags,
  tagsToQueryString,
  hasValue,
  filter,
}
