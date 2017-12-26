let _ = require('lodash/fp')

let toSafeRegex = caseSensitive =>
  _.flow(
    _.replace(/[.?+*|{}[\]()]/g, '\\$&'),
    _.map(
      x =>
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
        [field]: `.*${x}.*`,
      },
    })),
    x => ({
      bool: {
        must: x,
      },
    })
  )

module.exports = {
  toSafeRegex,
  buildRegexQueryForWords,
}
