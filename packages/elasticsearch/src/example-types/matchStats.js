let _ = require('lodash/fp')
let twoLevelMatch = require('./twoLevelMatch')

module.exports = {
  validContext: twoLevelMatch.validContext,
  result: (context, search) =>
    twoLevelMatch.result(
      _.merge(
        {
          config: {
            value_type: 'stats',
          },
        },
        context
      ),
      search
    ),
}
