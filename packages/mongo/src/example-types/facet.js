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

let sortAndLimitIfSearching = (shouldSortAndLimit, limit) => [
  shouldSortAndLimit &&
    ({ $sort: { count: -1 } }, limit !== 0 && { $limit: limit || 10 }),
]

let sortAndLimitIfNotSearching = (should, limit) =>
  sortAndLimitIfSearching(!should, limit)

let getSearchableKeysList = _.flow(
  _.getOr('_id', 'label.fields'),
  _.castArray,
  _.map(label => (label === '_id' ? label : `label.${label}`))
)

let getMatchesForMultipleKeywords = (list, optionsFilter) => ({
  $and: _.map(
    option => ({
      $or: _.map(
        key => ({
          [key]: {
            $regex: F.wordsToRegexp(option),
            $options: 'i',
          },
        }),
        list
      ),
    }),
    _.words(optionsFilter)
  ),
})

let setMatchOperators = (list, node) =>
  list.length > 1
    ? getMatchesForMultipleKeywords(list, node.optionsFilter)
    : {
        [_.first(list)]: {
          $regex: F.wordsToRegexp(node.optionsFilter),
          $options: 'i',
        },
      }

let mapKeywordFilters = node =>
  node.optionsFilter &&
  _.flow(getSearchableKeysList, list => ({
    $match: setMatchOperators(list, node),
  }))(node)

let facetValueLabel = (node, label) => {
  if (!node.label) {
    return {}
  }
  if (!node.label.fields || _.isArray(node.label.fields)) {
    return { label }
  }
  return {
    label: _.flow(_.values, _.first)(label),
  }
}

let unwindPropOrField = node =>
  _.map(
    field => ({ $unwind: `$${field}` }),
    _.castArray(node.unwind || node.field)
  )

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
          ...unwindPropOrField(node),
          { $group: { _id: `$${node.field}`, count: { $sum: 1 } } },
          ...sortAndLimitIfNotSearching(node.optionsFilter, node.size),
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
          mapKeywordFilters(node),
          ...sortAndLimitIfSearching(node.optionsFilter, node.size),
        ])
      ),
      search([
        ...unwindPropOrField(node),
        { $group: { _id: `$${node.field}` } },
        { $group: { _id: 1, count: { $sum: 1 } } },
      ]),
    ]).then(([options, cardinality]) => ({
      cardinality: _.get('0.count', cardinality),
      options: _.map(
        ({ _id, label, count }) =>
          F.compactObject({
            name: _id,
            count,
            ...facetValueLabel(node, label),
          }),
        options
      ),
    })),
}
