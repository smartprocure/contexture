let F = require('futil')
let _ = require('lodash/fp')
let { ObjectID } = require('mongodb')

let projectStageFromLabelFields = node => {
  let labelFields = _.get('valueLabelFields', node)
  return {
    $project: {
      count: 1,
      ..._.zipObject(
        _.map(fieldName => `labelData.${fieldName}`, labelFields),
        _.map(_.constant(1), labelFields)
      ),
    },
  }
}

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
          _.get('valueLabelCollection', node) && {
            $lookup: {
              from: _.get('valueLabelCollection', node),
              as: 'labelData',
              localField: '_id',
              foreignField: _.get('valueLabelForeignField', node),
            },
          },
          _.get('valueLabelCollection', node) && {
            $unwind: {
              path: '$labelData',
              preserveNullAndEmptyArrays: true,
            },
          },
          _.get('valueLabelFields', node) && projectStageFromLabelFields(node),
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
        ({ _id, labelData, count }) => ({
          name: _id,
          ...(_.get('valueLabelCollection', node)
            ? { labelData: labelData || {} }
            : {}),
          count,
        }),
        options
      ),
    })),
}
