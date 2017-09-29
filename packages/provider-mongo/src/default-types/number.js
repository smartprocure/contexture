var _ = require('lodash/fp')

module.exports = {
  hasValue: context => context.data.min || context.data.max,
  filter: context => ({
    [context.field]: _.pickBy(_.negate(_.isNil), {
      $gte: Number(context.data.min),
      $lte: Number(context.data.max)
    })
  })
}
