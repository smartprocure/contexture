let _ = require('lodash/fp')
let utils = require('../luceneQueryUtils')
let { parens } = require('futil-js')
// luceneValidator = require('lib/luceneValidator/luceneValidator');

let permutations = array => {
  let final = []
  if (array.length > 8) throw new RangeError('Array length must be less than 8')

  if (array.length === 2) {
    let reverse = Array.from(array)
    return [array, reverse.reverse()]
  }
  _.forEach(element => {
    element = _.castArray(element)

    let tail = _.without(element[0], array)
    let partial = permutations(tail)

    _.forEach(arr => {
      final.push(element.concat(arr))
    }, partial)
  }, array)

  return final
}

let wordPermutations = word => _.map(_.join(''), permutations(word.split(' ')))

let limitResultsToCertainTags = tags => !!_.find('onlyShowTheseResults', tags)

let wrapIf = _.curry(
  (pre, post, text, shouldWrap) => (shouldWrap ? `${pre}${text}${post}` : text)
)
let quoteIf = wrapIf('""', '""')

let quoteAndTilde = _.curry(
  (tag, text) =>
    quoteIf(text, tag.isPhrase) +
    (tag.misspellings || tag.distance ? '~' : '') +
    (tag.distance || '')
)

let tagsToQueryString = (tags, join) => {
  let shouldLimitToCertainWords = limitResultsToCertainTags(tags)
  return _.flow(
    _.filter(
      tag =>
        shouldLimitToCertainWords ? _.get('onlyShowTheseResults', tag) : true
    ),
    _.map(tag => {
      let _tag = utils.luceneQueryProcessor(tag.word)

      if (tag.distance === 'unlimited') {
        parens(_tag.replace(/\s+/g, ' and '))
      } else if (!tag.distance && tag.anyOrder) {
        parens(_.map(wordPermutations(_tag), quoteAndTilde(tag)).join(' or '))
      } else {
        quoteAndTilde(tag, _tag)
      }
    }),
    tags => {
      let joinedTags = tags.join({ all: ' and ', any: ' or ' }[join] || ' or ')
      if (joinedTags.length)
        return wrapIf('not (', ')', joinedTags, join === 'none')
      return ''
    }
  )(tags)
}

module.exports = {
  hasValue: _.get('tags.length'),
  filter(context) {
    let query = tagsToQueryString(context.tags, context.join)

    // Drop .untouched
    let field = context.field.replace('.untouched', '')

    let result = {
      query_string: {
        query,
        default_operator: 'AND',
        default_field: field + (context.exact ? '.exact' : '') || '_all',
      },
    }
    if (context.exact) result.query_string.analyzer = 'exact'

    return result
  },
}
