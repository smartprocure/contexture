let _ = require('lodash/fp')

let toSafeRegex = _.flow(
  _.replace(/[.?+*|{}[\]()]/g, '\\$&'),
  _.map(x => x.match(/[A-Za-z]/) ? `[${_.toUpper(x)}${_.toLower(x)}]` : x),
  _.join('')
)

let regexPartsForWords = _.flow(
  _.replace(/\s\s+/g, ' '),
  _.trim,
  _.split(' '),
  _.map(toSafeRegex)
)

let buildRegexQueryForWords = field =>
  _.flow(
    regexPartsForWords,
    _.map(x => ({ regexp: { [field]: `.*(${x}).*` } })),
    x => ({ bool: { must: x } })
  )

module.exports = {
  toSafeRegex,
  buildRegexQueryForWords,
}