let _ = require('lodash/fp')

let toSafeRegex = _.flow(_.replace(/[.?+*|{}[\]()]/g, ' '), _.trim)

let regexPartsForWords = _.flow(_.trim, _.split(/\s+/g), _.map(toSafeRegex))

let buildRegexQueryForWords = field =>
  _.flow(
    regexPartsForWords,
    _.map(x => ({
      regexp: {
        [field]: {
          value: `.*(${x}).*`,
          case_insensitive: true,
        },
      },
    })),
    x => ({ bool: { must: x } })
  )

module.exports = {
  toSafeRegex,
  buildRegexQueryForWords,
}
