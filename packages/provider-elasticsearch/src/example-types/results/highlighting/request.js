import _ from 'lodash/fp.js'
import F from 'futil'
import { minimatch } from 'minimatch'
import { CartesianProduct } from 'js-combinatorics'
import { isLeafField, isBlobField, isArrayOfObjectsField } from './util.js'

/*
 * Expand schema paths with wildcards into a list of paths without wildcards.
 * Paths for arrays of objects get expanded into its nested field paths. For
 * example if `friends` is an array of people, it gets expanded into
 * `[friends.name, friends.height, ...]`
 */
let expandGlobs = (schema, globs) => {
  let fieldsNames = _.keys(schema.fields)

  let expandGlob = (glob) =>
    isLeafField(schema.fields[glob])
      ? [glob]
      : minimatch.match(fieldsNames, `${glob}*`)

  return _.flow(
    _.flatMap(expandGlob),
    _.uniq,
    _.filter((path) => !isArrayOfObjectsField(schema.fields[path]))
  )(globs)
}

/*
 * Add given paths to source with includes/excludes lists. Paths get added to
 * source.includes and removed from source.excludes as necessary.
 *
 * Returns added paths.
 */
export let addPathsToRequestSource = (schema, source = {}, pathsToAdd = []) => {
  // There's nothing to add.
  if (_.isEmpty(pathsToAdd) || _.isEmpty(F.omitBlank(source))) {
    return source
  }

  // A source array is just includes.
  if (_.isArray(source)) {
    source = { includes: source }
  }

  let result = _.cloneDeep(source)

  // With wildcards expanded.
  let expanded = {
    includes: expandGlobs(schema, source.includes),
    excludes: expandGlobs(schema, source.excludes),
  }

  // Any path we "unexclude" is technically "added".
  let excludedFromExcludes = _.intersection(pathsToAdd, expanded.excludes)
  if (!_.isEmpty(excludedFromExcludes)) {
    result.excludes = _.difference(expanded.excludes, excludedFromExcludes)
  }

  // Also added are paths that were not originally included.
  let addedToIncludes = _.isEmpty(expanded.includes)
    ? []
    : _.difference(pathsToAdd, expanded.includes)
  if (!_.isEmpty(addedToIncludes)) {
    result.includes = _.union(expanded.includes, addedToIncludes)
  }

  let addedPaths = _.union(addedToIncludes, excludedFromExcludes)

  return F.omitBlank({ ...result, addedPaths })
}

/*
 * Names of all subfields that can be highlighted.
 */
let getHighlightSubFieldsNames = (schema) =>
  _.keys(_.pickBy('highlight', schema.elasticsearch?.subFields))

/*
 * Paths of all fields groups and their subfields that can be highlighted.
 */
export let getHighlightFieldsGroupsPaths = _.memoize((schema) => {
  let subFieldsNames = getHighlightSubFieldsNames(schema)
  return _.flatMap((field) => {
    let copy_to = field.elasticsearch?.mapping?.copy_to
    if (_.isEmpty(copy_to)) return []
    let subFieldTuples = [...new CartesianProduct(copy_to, subFieldsNames)]
    let product = [...copy_to, ..._.map(_.join('.'), subFieldTuples)]
    return product
  }, schema.fields)
}, _.get('elasticsearch.index'))

let isFieldsGroupPath = _.curry((schema, path) =>
  _.find(_.eq(path), getHighlightFieldsGroupsPaths(schema))
)

/*
 * Object of all fields and their subfields that can be highlighted.
 */
export let getAllHighlightFields = _.memoize((schema) => {
  let subFieldsNames = getHighlightSubFieldsNames(schema)
  return F.reduceIndexed(
    (acc, field, path) => {
      if (!isLeafField(field) || isFieldsGroupPath(schema, path)) {
        return acc
      }
      acc[path] = field
      let subFields = _.pick(
        subFieldsNames,
        field.elasticsearch?.mapping?.fields
      )
      for (let name in subFields) {
        acc[`${path}.${name}`] = F.omitBlank({
          subType: field.subType,
          elasticsearch: F.omitBlank({
            mapping: F.omitBlank({
              ...subFields[name],
              copy_to: _.map(
                (path) => `${path}.${name}`,
                field.elasticsearch.mapping?.copy_to
              ),
            }),
          }),
        })
      }
      return acc
    },
    {},
    schema.fields
  )
}, _.get('elasticsearch.index'))

let collectKeysAndValues = (f, coll) =>
  F.reduceTree()(
    (acc, val, key) =>
      f(val) ? F.push(val, acc) : f(key) ? F.push(key, acc) : acc,
    [],
    coll
  )

let blobConfiguration = {
  fragment_size: 250,
  number_of_fragments: 3,
}

/*
 * Get configuration for highlight fields to send in the elastic request.
 */
export let getRequestHighlightFields = (schema, node) => {
  let fieldGroupsInQuery = collectKeysAndValues(
    isFieldsGroupPath(schema),
    node._meta?.relevantFilters
  )

  // Stringifying once and then replacing paths and parsing the query again is
  // more performant than walking the query.
  let queryStr = JSON.stringify(node._meta?.relevantFilters)

  let getHighlightQuery = (field, path) => {
    let pathsToReplace = _.intersection(
      fieldGroupsInQuery,
      field.elasticsearch?.mapping?.copy_to
    )
    if (!_.isEmpty(pathsToReplace)) {
      let regexp = new RegExp(_.join('|', pathsToReplace), 'g')
      return JSON.parse(_.replace(regexp, path, queryStr))
    }
  }

  return F.mapValuesIndexed(
    (field, path) =>
      F.omitBlank({
        ...(isBlobField(field) && blobConfiguration),
        highlight_query: getHighlightQuery(field, path),
      }),
    getAllHighlightFields(schema)
  )
}
