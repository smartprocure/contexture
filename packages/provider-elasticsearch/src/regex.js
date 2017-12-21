let _ = require('lodash/fp')

module.exports = {
  toSafeRegex: caseSensitive =>
    _.flow(
      _.replace(/[.?+*|{}[]()]/g, '\\$&'),
      _.map(
        x =>
          !caseSensitive && x.match(/[A-Za-z]/)
            ? `[${_.toUpper(x)}${_.toLower(x)}]`
            : x
      ),
      _.join('')
    ),
}
