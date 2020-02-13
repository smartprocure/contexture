let F = require('futil')
let _ = require('lodash/fp')

let convertPopulate = getSchema =>
  _.flow(
    F.mapIndexed((x, as) => {
      let { unwind, schema } = x
      let targetSchema = getSchema(schema) //|| toSingular(as), //<-- needs compromise-fp
      if (!targetSchema)
        throw Error(`Couldn't find schema configuration for ${schema}`)
      if (!targetSchema.mongo)
        throw Error(
          'Populating a non mongo provider schema on a mongo provider schema is not supported'
        )
      let targetCollection = _.get('mongo.collection', targetSchema)
      if (!targetCollection)
        throw Error(
          `The ${targetCollection} schema has a mongo configuration, but doesn't have a 'collection' property`
        )

      let $unwind = unwind
        ? [
            {
              $unwind: {
                path: `$${as}`,
                preserveNullAndEmptyArrays: true,
              },
            },
          ]
        : []
      let $lookup = [
        {
          $lookup: {
            as,
            from: targetCollection,
            localField: x.localField, // || '_id',
            foreignField: x.foreignField, // || node.schema, <-- needs schema lookup
          },
        },
      ]
      return [...$lookup, ...$unwind]
    }),
    _.flatten
  )

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

let getResultsQuery = (node, getSchema, startRecord) => {
  let { pageSize, sortField, sortDir, populate, include } = node

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
  let $project = _.isEmpty(include)
    ? []
    : [{ $project: projectFromInclude(include) }]

  return [
    ...(!sortOnJoinField ? sortSkipLimit : []),
    ...convertPopulate(getSchema)(populate),
    ...(sortOnJoinField ? sortSkipLimit : []),
    ...$project,
  ]
}

let defaults = _.defaults({
  page: 1,
  pageSize: 10,
  sortDir: 'desc',
  include: [],
})

let result = async (node, search, schema, { getSchema }) => {
  node = defaults(node)
  let startRecord = getStartRecord(node)
  let resultsQuery = getResultsQuery(node, getSchema, startRecord)
  let countQuery = [{ $group: { _id: null, count: { $sum: 1 } } }]

  let [results, count] = await Promise.all([
    search(resultsQuery),
    !node.skipCount && search(countQuery),
  ])

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
  getStartRecord,
  getResultsQuery,
  defaults,
  projectFromInclude,
  convertPopulate,
  // API
  result,
}
