var _ = require('lodash/fp')

module.exports = {
  hasValue: context => context.min || context.max,
  filter: context => ({
    [context.field]: _.pickBy(_.negate(_.isNil), {
      $gte: Number(context.min),
      $lte: Number(context.max),
    }),
  }),
}
