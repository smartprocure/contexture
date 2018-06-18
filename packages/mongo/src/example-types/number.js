var _ = require('lodash/fp')

let cleanFilter = _.flow(
  _.pickBy(_.negate(_.isNil)),
  _.mapValues(_.toNumber)
)

module.exports = {
  hasValue: context =>
    _.isNumber(context.min) ||
    _.isNumber(context.max),
  filter: context => ({
    [context.field]: cleanFilter({
      $gte: context.min,
      $lte: context.max,
    }),
  }),
}
