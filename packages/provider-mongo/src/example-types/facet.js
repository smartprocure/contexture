let F = require('futil')
let _ = require('lodash/fp')
let { ObjectID } = require('mongodb')

let projectStageFromLabelFields = node => ({
  $project: {
    count: 1,
    ...F.arrayToObject(
      fieldName => `label.${fieldName}`,
      _.constant(1)
    )(_.flow(_.get('label.fields'), _.castArray)(node)),
  },
})

module.exports = {
  hasValue: _.get('values.length'),
  filter: node => ({
    [node.field]: {
      [node.mode === 'exclude' ? '$nin' : '$in']: node.isMongoId
        ? _.map(ObjectID, node.values)
        : node.values,
    },
  }),
  result: (node, search) =>
    Promise.all([
      search(
        _.compact([
          // Unwind allows supporting array and non array fields - for non arrays, it will treat as an array with 1 value
          // https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/#non-array-field-path
          { $unwind: `$${node.field}` },
          { $group: { _id: `$${node.field}`, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          node.optionsFilter && {
            $match: {
              _id: {
                $regex: F.wordsToRegexp(node.optionsFilter),
                $options: 'i',
              },
            },
          },
          node.size !== 0 && { $limit: node.size || 10 },
          ...(_.get('label', node)
            ? [
                {
                  $lookup: {
                    from: _.get('label.collection', node),
                    as: 'label',
                    localField: '_id',
                    foreignField: _.get('label.foreignField', node),
                  },
                },
                {
                  $unwind: {
                    path: '$label',
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ]
            : []),
          _.get('label.fields', node) && projectStageFromLabelFields(node),
        ])
      ),
      search([
        { $unwind: `$${node.field}` },
        { $group: { _id: `$${node.field}` } },
        { $group: { _id: 1, count: { $sum: 1 } } },
      ]),
    ]).then(([options, cardinality]) => ({
      cardinality: _.get('0.count', cardinality),
      options: _.map(
        ({ _id, label, count }) => F.compactObject({ name: _id, label, count }),
        options
      ),
    })),
}
