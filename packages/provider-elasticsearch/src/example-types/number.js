let _ = require('lodash/fp')

/*
 1. An empty value as the upper boundary represents infinity.
 2. An empty value as the lower boundary represents negative infinity.
 3. Zero has to be respected as a boundary value.
*/
let boundaryFilter = value => {
  if (_.isString(value) && _.isEmpty(value)) value = NaN
  return _.isNaN(_.toNumber(value)) ? null : _.toNumber(value)
}

module.exports = {
  hasValue: context => context.data.min || context.data.max,
  filter: context => ({
    range: {
      [context.field]: _.pickBy(_.isNumber, {
        gte: boundaryFilter(context.data.min),
        lte: boundaryFilter(context.data.max)
      })
    }
  })
}
