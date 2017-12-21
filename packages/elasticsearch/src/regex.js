let _ = require('lodash/fp')

module.exports = {
  toSafeRegex: caseSensitive =>
    _.flow(
      _.replace(/[.?+*|{}[]()]/g, '\\$&'),
      _.map(
        x =>
          !caseSensitive && x.match(/[A-Za-z]/)
            ? `[${_.toLower(x)}${_.toUpper(x)}]`
            : x
      ),
      _.join('')
    )
}
