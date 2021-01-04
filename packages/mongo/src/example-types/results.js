let F = require('futil')
let _ = require('lodash/fp')

/*
 * Takes `({ fields: { firstName: '', lastName: ''} }, ['firstName'], 'nickname')`
 * and returns `{ nickname.lastName: 0 }`. Used to filter the props of $lookup-ed records
 * for populates down to the includes specified in those populates
 */
let omitFromInclude = (schema, include, as) => {
  let allTargetFields = _.keys(_.get('fields', schema))
  let omittedFields = _.difference(allTargetFields, include)

  return F.arrayToObject(
    field => `${as}.${field}`,
    _.constant(0)
  )(omittedFields)
}

let convertPopulate = getSchema =>
  _.flow(
    F.mapIndexed((x, as) => {
      let { unwind, schema, include, localField, foreignField = '_id' } = x
      let targetSchema = getSchema(schema) //|| toSingular(as), //<-- needs compromise-fp
      if (!targetSchema)
        throw Error(`Couldn't find schema configuration for ${schema}`)
      if (!targetSchema.mongo)
        throw Error('Populating from a non-mongo schema is not supported')
      let targetCollection = _.get('mongo.collection', targetSchema)
      if (!targetCollection)
        throw Error(
          `The ${schema} schema has a mongo configuration without a 'collection' property`
        )

      let $lookup = {
        $lookup: {
          as,
          from: targetCollection,
          localField,
          foreignField, // || node.schema, <-- needs schema lookup
        },
      }

      // at this point we know we want to place the foreign collection record on the
      // local record at the `as` prop, narrowing the foreign record's props down to those
      // specified by the populate's includes. In order not to lose the other props on the 
      // local record aside from the `as` prop, we need to omit the fields of the `as` prop
      // object we don't want by diffing the populate's includes with the foreign schema
      // specified by the populate. THis is what the `omitFromInclude` util does
      let $project = include
        ? { $project: omitFromInclude(targetSchema, include, as) }
        : null

      let $unwind = unwind && {
        $unwind: {
          path: `$${as}`,
          preserveNullAndEmptyArrays: true,
        },
      }

      return _.compact([$lookup, $unwind, $project])
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
  let { pageSize, sortField, sortDir, populate, include, skipCount } = node

  // $sort, $skip, $limit
  let $sort = {
    $sort: {
      [sortField]: sortDir === 'asc' ? 1 : -1,
    },
  }

  let $limit = { $limit: F.when(skipCount, _.add(1), pageSize) }
  let sort = _.compact([sortField && $sort])
  let skipLimit = _.compact([{ $skip: startRecord }, pageSize > 0 && $limit])
  let sortSkipLimit = _.compact([...sort, ...skipLimit])
  // If sort field is a join field move $sort, $skip, and $limit to after $lookup.
  // Otherwise, place those stages first to take advantage of any indexes on that field.
  let sortOnJoinField = _.some(
    x => _.startsWith(`${x}.`, sortField) || sortField === x,
    _.keys(populate)
  )
  // check if any of the "populate" fields are indicating they can have more than one record
  let hasMany = _.some(_.get('hasMany'), populate)
  // $project
  let $project = _.isEmpty(include)
    ? []
    : [{ $project: projectFromInclude(include) }]

  return [
    ...(!sortOnJoinField && !hasMany ? sortSkipLimit : []),
    // if "hasMany" is set on a "populate" field but we are not sorting on a "populate" field, sort as early as possible
    ...(hasMany && !sortOnJoinField ? sort : []),
    ...convertPopulate(getSchema)(populate),
    ...(sortOnJoinField ? sortSkipLimit : []),
    ...(hasMany && !sortOnJoinField ? skipLimit : []),
    ...$project,
  ]
}

let defaults = _.defaults({
  page: 1,
  pageSize: 10,
  sortDir: 'desc',
  skipCount: false, // F.when doesn't like undefined
  include: [],
})

let getResponse = (node, results, count) => {
  let startRecord = getStartRecord(node)
  return {
    totalRecords: count,
    startRecord: startRecord + 1,
    endRecord: startRecord + _.min([results.length, node.pageSize]),
    ...(node.skipCount && { hasMore: results.length > node.pageSize }),
    results: _.take(node.pageSize, results),
  }
}

let result = async (node, search, schema, { getSchema }) => {
  node = defaults(node)
  let hasMany = _.some(_.get('hasMany'), node.populate)
  let resultsQuery = getResultsQuery(node, getSchema, getStartRecord(node))
  let countQuery = [
    ...(hasMany ? convertPopulate(getSchema)(node.populate) : []),
    { $group: { _id: null, count: { $sum: 1 } } },
  ]

  let [results, count] = await Promise.all([
    search(resultsQuery),
    !node.skipCount && search(countQuery),
  ])

  return { response: getResponse(node, results, _.get('0.count', count)) }
}

// NOTE: pageSize of 0 will return all records
module.exports = {
  getStartRecord,
  getResultsQuery,
  getResponse,
  defaults,
  projectFromInclude,
  convertPopulate,
  // API
  result,
}
