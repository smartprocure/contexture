let _ = require('lodash')
let twoLevelMatch = require('./twoLevelMatch')

module.exports = {
  validContext: twoLevelMatch.validContext,
  result: (context, search) =>
    twoLevelMatch.result(
      _.merge(
        {
          config: {
            value_type: 'cardinality',
          },
        },
        context
      ),
      search
    ),
}
