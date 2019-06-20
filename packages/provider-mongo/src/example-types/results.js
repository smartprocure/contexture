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

let getResultsQuery = (context, getSchema, startRecord) => {
  let { pageSize, sortField, sortDir, populate, include } = context

  let $sort = {
    [sortField]: sortDir === 'asc' ? 1 : -1,
  }

  // $sort, $skip, $limit
  let sortSkipLimit = [
    { $sort },
    { $skip: startRecord },
    pageSize > 0 && {
      $limit: pageSize,
    },
  ]
  // If sort field contains a '.' move $sort, $skip, and $limit to after $lookup.
  // Otherwise, place those first to take advantage of any indexes on that field.
  let sortOnJoinField = _.includes(
    _.replace(/^([^.]+)\..+$/, '$1', sortField),
    _.keys(populate)
  )
  // $project
  let $project = [
    { $project: _.zipObject(include, _.times(_.constant(1), include.length)) },
  ]

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
  sortField: '_score',
  sortDir: 'desc',
  include: [],
})

let result = async (context, search, schema, { getSchema }) => {
  context = defaults(context)
  let startRecord = getStartRecord(context)
  let resultsQuery = getResultsQuery(context, getSchema, startRecord)
  let countQuery = [{ $group: { _id: null, count: { $sum: 1 } } }]

  let [results, count] = await Promise.all([
    search(resultsQuery),
    search(countQuery),
  ])

  return {
    // TODO - handle aggregate wrapped stuff, e.g. result.result or result.result[0] etc
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
  // API
  result,
}
