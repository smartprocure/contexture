var _ = require('lodash/fp')

let cleanFilter = _.flow(
  _.pickBy(_.negate(_.isNil)),
  _.mapValues(_.toNumber)
)

module.exports = {
  hasValue: _.flow(
    _.pick(['min', 'max']),
    _.mapValues(_.toNumber),
    _.some(x => !_.isNaN(x))
  ),
  filter: ({field, min, max}) => ({
    [field]: cleanFilter({
      $gte: min,
      $lte: max,
    }),
  }),
}
