let _ = require('lodash/fp')
let Promise = require('bluebird')
let { ObjectID } = require('mongodb')

let buildRegex = _.flow(
  _.replace(/\s\s+/g, ' '),
  _.trim,
  _.split(' '),
  _.map(x => `(?=.*${x}.*)`),
  _.join(''),
  x => `.*${x}.*`
)

module.exports = {
  hasValue: _.get('values.length'),
  filter: context => ({
    [context.field]: {
      [context.mode === 'exclude' ? '$nin' : '$in']: context.isMongoId
        ? _.map(ObjectID, context.values)
        : context.values,
    },
  }),
  result: (context, search) =>
    Promise.all([
      search(
        _.compact([
          // Unwind allows supporting array and non array fields - for non arrays, it will treat as an array with 1 value
          // https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/#non-array-field-path
          { $unwind: `$${context.field}` },
          {
            $group: {
              _id: `$${context.field}`,
              count: {
                $sum: 1,
              },
            },
          },
          { $sort: { count: -1 } },
          context.optionsFilter && {
            $match: {
              _id: {
                $regex: buildRegex(context.optionsFilter),
                $options: 'i',
              },
            },
          },
          context.size !== 0 && {
            $limit: context.size || 10,
          },
        ])
      ),
      search([
        { $unwind: `$${context.field}` },
        {
          $group: {
            _id: `$${context.field}`,
          },
        },
        {
          $group: {
            _id: 1,
            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]).spread((options, cardinality) => ({
      cardinality: _.get('0.count', cardinality),
      options: _.map(
        x => ({
          name: x._id,
          count: x.count,
        }),
        options
      ),
    })),
}
