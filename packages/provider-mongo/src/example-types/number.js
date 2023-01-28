import _ from 'lodash/fp.js'

let predicate = x =>
  (_.isString(x) || _.isNumber(x)) && x !== '' && _.isFinite(_.toNumber(x))

let cleanFilter = _.flow(_.pickBy(predicate), _.mapValues(_.toNumber))

export default {
  hasValue: _.flow(_.pick(['min', 'max']), _.some(predicate)),
  filter: ({ field, min, max }) => ({
    [field]: cleanFilter({
      $gte: min,
      $lte: max,
    }),
  }),
}
