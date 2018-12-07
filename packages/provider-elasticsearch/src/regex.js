let _ = require('lodash/fp')
let F = require('futil-js')
let Combinatorics = require('js-combinatorics')

let toSafeRegex = caseSensitive =>
  _.flow(
    _.replace(/[.?+*|{}[\]()]/g, '\\$&'),
    _.map(x =>
      !caseSensitive && x.match(/[A-Za-z]/)
        ? `[${_.toUpper(x)}${_.toLower(x)}]`
        : x
    ),
    _.join('')
  )

let regexPartsForWords = caseSensitive =>
  _.flow(
    _.replace(/\s\s+/g, ' '),
    _.trim,
    _.split(' '),
    _.map(toSafeRegex(caseSensitive))
  )

let buildRegexQueryForWords = (field, caseSensitive) =>
  _.flow(
    regexPartsForWords(caseSensitive),
    _.map(x => ({
      regexp: {
        [field]: `.*(${x}).*`,
      },
    })),
    x => ({
      bool: {
        must: x,
      },
    })
  )

let regexAnd = _.flow(
  Combinatorics.permutation,
  x => x.toArray(),
  _.map(_.join('.*')),
  _.map(F.parens),
  _.join('|')
)

let buildRegexForWords = (caseSensitive, anyOrder = true, maxWords = 3) =>
  _.flow(
    _.split(' '),
    _.map(toSafeRegex(caseSensitive)),
    x => (anyOrder && x.length <= maxWords ? regexAnd(x) : _.join('.*', x)), // This enforces order, for any order we either need `&` (intersection which is behind a flag and not available here) or to do every combination of patterns joined by .* and or'ed together
    x => `.*(${x}).*`
  )

module.exports = {
  toSafeRegex,
  regexAnd,
  buildRegexQueryForWords,
  buildRegexForWords,
}
