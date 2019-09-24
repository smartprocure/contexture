let F = require('futil-js')
let _ = require('lodash/fp')

let lookupFromPopulate = getSchema =>
  F.mapIndexed((x, as) => {
    let targetSchema = getSchema(x.schema) //|| toSingular(as), //<-- needs compromise-fp
    if (!targetSchema)
      throw Error(`Couldn't find schema configuration for ${x.schema}`)
    if (!targetSchema.mongo)
      throw Error(
        'Populating a non mongo provider schema on a mongo provider schema is not supported'
      )
    let targetCollection = _.get('mongo.collection', targetSchema)
    if (!targetCollection)
      throw Error(
        `The ${targetCollection} schema has a mongo configuration, but doesn't have a 'collection' property`
      )

    return {
      $lookup: {
        as,
        from: targetCollection,
        localField: x.localField, // || '_id',
        foreignField: x.foreignField, // || context.schema, <-- needs schema lookup
      },
    }
  })

let getStartRecord = ({ page, pageSize }) => {
  page = page < 1 ? 0 : page - 1
  return page * pageSize
}

let parentPath = path => path.replace(/(\.[^.]+)$/, '')

let isParentPathProjected = include => path =>
  _.some(_.eq(parentPath(path)), _.pull(path, include))

let projectFromInclude = include =>
  _.flow(
    _.remove(isParentPathProjected(include)),
    _.countBy(_.identity)
  )(include)

let getResultsQuery = (context, getSchema, startRecord) => {
  let { pageSize, sortField, sortDir, populate, include } = context

  // $sort, $skip, $limit
  let $sort = {
    $sort: {
      [sortField]: sortDir === 'asc' ? 1 : -1,
    },
  }
  let $limit = { $limit: pageSize }
  let sortSkipLimit = _.compact([
    sortField && $sort,
    { $skip: startRecord },
    pageSize > 0 && $limit,
  ])
  // If sort field is a join field move $sort, $skip, and $limit to after $lookup.
  // Otherwise, place those stages first to take advantage of any indexes on that field.
  let sortOnJoinField = _.some(
    x => _.startsWith(`${x}.`, sortField) || sortField === x,
    _.keys(populate)
  )
  // $project
  let $project = [{ $project: projectFromInclude(include) }]

  return [
    ...(!sortOnJoinField ? sortSkipLimit : []),
    ...lookupFromPopulate(getSchema)(populate),
    ...(sortOnJoinField ? sortSkipLimit : []),
    ...(!_.isEmpty(include) ? $project : []),
  ]
}

let defaults = _.defaults({
  page: 1,
  pageSize: 10,
  sortDir: 'desc',
  include: [],
})

let rowsToObjectConverter = _.curry((populateConfig, row) => {
  let singularProps = _.flow(
    _.pickBy('singularObject'),
    _.keys
  )(populateConfig)

  return _.flow(
    _.pick(singularProps),
    _.mapValues(_.first)
  )(row)
})

let convertRows = (converter, results) =>
  _.map(row => _.extend(row, converter(row)), results)
let result = async (context, search, schema, { getSchema }) => {
  context = defaults(context)
  let startRecord = getStartRecord(context)
  let resultsQuery = getResultsQuery(context, getSchema, startRecord)
  let countQuery = [{ $group: { _id: null, count: { $sum: 1 } } }]
  let { populate } = context

  let [results, count] = await Promise.all([
    search(resultsQuery),
    search(countQuery),
  ])

  // Handle the "singularObject" for each populate config
  if (populate) {
    let converter = rowsToObjectConverter(populate)
    results = convertRows(converter, results)
  }

  return {
    response: {
      totalRecords: _.get('0.count', count),
      startRecord: startRecord + 1,
      endRecord: startRecord + results.length,
      results,
    },
  }
}

// NOTE: pageSize of 0 will return all records
module.exports = {
  lookupFromPopulate,
  getStartRecord,
  getResultsQuery,
  defaults,
  projectFromInclude,
  rowsToObjectConverter,
  convertRows,
  // API
  result,
}
