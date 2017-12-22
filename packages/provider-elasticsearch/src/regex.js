let _ = require('lodash/fp')
let F = require('futil-js')
let Combinatorics = require('js-combinatorics')

let toSafeRegex = caseSensitive =>
  _.flow(
    _.replace(/[.?+*|{}\[\]()]/g, '\\$&'),
    _.map(
      x =>
        !caseSensitive && x.match(/[A-Za-z]/)
          ? `[${_.toUpper(x)}${_.toLower(x)}]`
          : x
    ),
    _.join('')
  )

let regexAnd = _.flow(
  Combinatorics.permutation,
  x => x.toArray(),
  _.map(_.join('.*')),
  _.map(F.parens),
  _.join('|')
)

let buildRegexForWords = (caseSensitive, anyOrder) =>
  _.flow(
    _.split(' '),
    _.map(toSafeRegex(caseSensitive)),
    anyOrder ? regexAnd : _.join('.*'), // This enforces order, for any order we either need `&` (intersection which is behind a flag and not available here) or to do every combination of patterns joined by .* and or'ed together
    x => `.*${x}.*`
  )

module.exports = {
  toSafeRegex,
  regexAnd,
  buildRegexForWords,
}
