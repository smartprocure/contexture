let _ = require('lodash/fp'),
  twoLevelMatch = require('./twoLevelMatch')

module.exports = {
  validContext: twoLevelMatch.validContext,
  result: (context, search) =>
    twoLevelMatch.result(
      _.merge(
        {
          config: {
            value_type: 'stats'
          }
        },
        context
      ),
      search
    )
}
