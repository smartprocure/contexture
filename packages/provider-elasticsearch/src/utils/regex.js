let _ = require('lodash/fp')

let toSafeRegex = _.flow(_.replace(/[.?+*|{}[\]()]/g, ''))

let regexPartsForWords = _.flow(_.split(/\s+/g), _.map(toSafeRegex))

let buildRegexQueryForWords = field =>
  _.flow(
    regexPartsForWords,
    _.map(x => ({
      regexp: {
        [field]: `.*?(${x}).*?`,
        case_insensitive: true,
      },
    })),
    x => ({ bool: { must: x } })
  )

module.exports = {
  toSafeRegex,
  buildRegexQueryForWords,
}
