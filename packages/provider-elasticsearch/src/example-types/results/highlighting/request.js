import _ from 'lodash/fp.js'
import F from 'futil'
import { minimatch } from 'minimatch'
import { CartesianProduct } from 'js-combinatorics'
import { areArraysEqual } from '../../../utils/futil.js'
import {
  isLeafField,
  isBlobField,
  isArrayOfObjectsField,
  findByPrefix,
} from './util.js'

/*
 * Expand schema paths with wildcards into a list of paths without wildcards.
 * Paths for arrays of objects get expanded into its nested field paths. For
 * example if `friends` is an array of people, it gets expanded into
 * `[friends.name, friends.height, ...]`
 */
const expandGlobs = (schema, globs) => {
  const fieldsNames = _.keys(schema.fields)

  const expandGlob = (glob) =>
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
export const addPathsToRequestSource = (schema, source, paths) => {
  // There's nothing to add.
  if (_.isEmpty(paths) || _.isEmpty(F.omitBlank(source))) {
    return []
  }

  // A source array is just includes.
  if (_.isArray(source)) {
    source = { includes: source }
  }

  // With wildcards expanded.
  const expanded = {
    includes: expandGlobs(schema, source.includes),
    excludes: expandGlobs(schema, source.excludes),
  }

  // To understand this, visualize a Venn diagram with three intersecting sets
  // one for each of includes, excludes, and paths.
  const pathsToAdd = _.union(
    // Any path we "unexclude" is technically "added".
    _.intersection(paths, expanded.excludes),
    // Also added are paths that were not originally included.
    _.isEmpty(source.includes) ? [] : _.difference(paths, expanded.includes)
  )

  // There's nothing to add.
  if (_.isEmpty(pathsToAdd)) {
    return []
  }

  const withAddedPaths = F.omitBlank({
    includes: _.union(pathsToAdd, expanded.includes),
    excludes: _.difference(expanded.excludes, pathsToAdd),
  })

  const shouldAddPaths = (key) =>
    !areArraysEqual(expanded[key], withAddedPaths[key])

  if (!_.isEmpty(source.includes) && shouldAddPaths('includes')) {
    source.includes = withAddedPaths.includes
  }

  if (shouldAddPaths('excludes')) {
    source.excludes = withAddedPaths.excludes
  }

  return pathsToAdd
}

/*
 * Names of all subfields that can be highlighted.
 */
const getHighlightSubFieldsNames = (schema) =>
  _.keys(_.pickBy('highlight', schema.elasticsearch?.subFields))

/*
 * Paths of all fields groups and their subfields that can be highlighted.
 */
export const getHighlightFieldsGroupsPaths = _.memoize((schema) => {
  const subFieldsNames = getHighlightSubFieldsNames(schema)
  return _.flatMap((field) => {
    const copy_to = field.elasticsearch?.copy_to
    if (_.isEmpty(copy_to)) return copy_to ?? []
    const product = new CartesianProduct(copy_to, subFieldsNames)
    return [...(copy_to ?? []), ..._.map(_.join('.'), [...product])]
  }, schema.fields)
}, _.get('elasticsearch.index'))

const isFieldsGroupPath = (schema, path) =>
  !!findByPrefix(path, getHighlightFieldsGroupsPaths(schema))

/*
 * Object of all fields and their subfields that can be highlighted.
 */
export const getAllHighlightFields = _.memoize((schema) => {
  const subFieldsNames = getHighlightSubFieldsNames(schema)
  return F.reduceIndexed(
    (acc, field, path) => {
      if (!isLeafField(field) || isFieldsGroupPath(schema, path)) {
        return acc
      }
      acc[path] = field
      const subFields = _.pick(subFieldsNames, field.elasticsearch.fields)
      for (const name in subFields) {
        acc[`${path}.${name}`] = {
          elasticsearch: {
            ...subFields[name],
            meta: field.elasticsearch.meta,
            copy_to: _.map(
              (path) => `${path}.${name}`,
              field.elasticsearch.copy_to
            ),
          },
        }
      }
      return acc
    },
    {},
    schema.fields
  )
}, _.get('elasticsearch.index'))

/*
 * Get configuration for highlight fields to send in the elastic request.
 */
export const getRequestHighlightFields = (schema, node) => {
  const fieldGroupsInQuery = F.reduceTree()(
    (acc, val, key) =>
      isFieldsGroupPath(schema, val)
        ? F.push(val, acc)
        : isFieldsGroupPath(schema, key)
        ? F.push(key, acc)
        : acc,
    [],
    node._meta?.relevantFilters
  )

  const queryStr = JSON.stringify(node._meta?.relevantFilters)

  const getHighlightQuery = (field, path) => {
    const pathsToReplace = _.intersection(
      fieldGroupsInQuery,
      field.elasticsearch?.copy_to
    )
    if (!_.isEmpty(pathsToReplace)) {
      const regexp = new RegExp(_.join('|', pathsToReplace), 'g')
      return JSON.parse(_.replace(regexp, path, queryStr))
    }
  }

  return F.mapValuesIndexed(
    (field, path) =>
      F.omitBlank({
        fragment_size: isBlobField(field) ? 250 : null,
        number_of_fragments: isBlobField(field) ? 3 : null,
        highlight_query: getHighlightQuery(field, path),
      }),
    getAllHighlightFields(schema)
  )
}
