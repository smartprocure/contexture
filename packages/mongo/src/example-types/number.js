var _ = require('lodash/fp')

let predicate = x =>
  (_.isString(x) || _.isNumber(x)) && x !== '' && _.isFinite(_.toNumber(x))

let cleanFilter = _.flow(
  _.pickBy(predicate),
  _.mapValues(_.toNumber)
)

module.exports = {
  hasValue: _.flow(
    _.pick(['min', 'max']),
    _.some(predicate)
  ),
  filter: ({ field, min, max }) => ({
    [field]: cleanFilter({
      $gte: min,
      $lte: max,
    }),
  }),
}
