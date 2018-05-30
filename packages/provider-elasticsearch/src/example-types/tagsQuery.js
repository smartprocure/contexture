let _ = require('lodash/fp')
let { parens } = require('futil-js')
let Combinatorics = require('js-combinatorics')

let wordPermutations = word =>
  _.map(_.join(' '), Combinatorics.permutation(word.split(' ')).toArray())

let limitResultsToCertainTags = tags => !!_.find('onlyShowTheseResults', tags)

let wrapIf = _.curry(
  (pre, post, text, shouldWrap) => (shouldWrap ? `${pre}${text}${post}` : text)
)
let quoteIf = wrapIf('"', '"')

let quoteAndTilde = _.curry(
  (tag, text) =>
    quoteIf(text, tag.isPhrase) +
    (tag.misspellings || tag.distance ? '~' : '') +
    (tag.distance || '')
)

let escapeSpecialChars = text =>
  text.toString().replace(/([!*+\-=<>&|()[\]{}^~?:\\/"])/g, '\\$1')

let tagToQueryString = tag => {
  let _tag = escapeSpecialChars(tag.word)

  if (tag.distance === 'unlimited') {
    return parens(_tag.replace(/\s+/g, ' AND '))
  } else if (!tag.distance && tag.anyOrder) {
    return parens(
      _.map(quoteAndTilde(tag), wordPermutations(_tag)).join(' OR ')
    )
  } else {
    return quoteAndTilde(tag, _tag)
  }
}

let joinTags = join => tags => {
  let joinedTags = tags.join({ all: ' AND ', any: ' OR ' }[join] || ' OR ')
  if (joinedTags.length)
    return wrapIf('NOT (', ')', joinedTags, join === 'none')
  return ''
}

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
  quoteIf,
  quoteAndTilde,
  escapeSpecialChars,
  tagToQueryString,
  joinTags,
  tagsToQueryString,
  hasValue,
  filter,
}
