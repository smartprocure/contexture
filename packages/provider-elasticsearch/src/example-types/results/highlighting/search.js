import _ from 'lodash/fp.js'
import F from 'futil'
import { minimatch } from 'minimatch'
import { removePrefix } from '../../../utils/futil.js'
import {
  isLeafField,
  findByPrefix,
  getArrayOfObjectsPathsMap,
  isArrayOfObjectsField,
} from './util.js'
import { getHighlightFields } from './request.js'
import { transformResponseHighlight } from './response.js'
import { mergeHighlightsOnSource } from './merging.js'

const areArraysEqual = _.flow(_.xor, _.isEmpty)

export const addPathsToSource = (schema, body, paths) => {
  const { includes, excludes } = body._source ?? {}

  // Nothing to do
  if (_.isEmpty(paths) || (_.isEmpty(includes) && _.isEmpty(excludes))) {
    return
  }

  const fieldsNames = _.keys(schema.fields)
  const expandGlob = (glob) =>
    isLeafField(schema.fields[glob])
      ? [glob]
      : minimatch.match(fieldsNames, `${glob}*`)

  const expandGlobs = _.flow(
    _.flatMap(expandGlob),
    _.uniq,
    _.filter((path) => !isArrayOfObjectsField(schema.fields[path]))
  )

  // Expanded wildcards
  const expanded = {
    includes: expandGlobs(includes),
    excludes: expandGlobs(excludes),
  }

  // To understand this, visualize a Venn diagram where there are three spheres,
  // one for each of includes, excludes, and paths.
  const added = _.union(
    // Any path we "unexclude" is technically "added".
    _.intersection(paths, expanded.excludes),
    // Also added are paths that were not originally included.
    _.isEmpty(body._source.includes)
      ? []
      : _.difference(paths, expanded.includes)
  )

  // There's nothing being added so just return source unchanged.
  if (_.isEmpty(added)) {
    return
  }

  const adjusted = {
    includes: _.union(added, expanded.includes),
    excludes: _.difference(expanded.excludes, added),
  }

  // Try to use source.{includes,excludes} whenever possible to reduce payload.
  body._source = F.omitBlank({
    includes:
      _.isEmpty(includes) ||
      areArraysEqual(adjusted.includes, expanded.includes)
        ? includes
        : _.union(added, includes),
    excludes:
      _.isEmpty(excludes) ||
      areArraysEqual(adjusted.excludes, expanded.excludes)
        ? excludes
        : adjusted.excludes,
  })

  return added
}

// This function would be easier to implement if we had a tree filter function
export const removePathsFromSource = (schema, hit, paths) => {
  if (_.isEmpty(paths)) {
    return
  }

  const arrayOfObjectsPaths = F.mapValuesIndexed(
    (paths, arrayPath) =>
      _.map((path) => removePrefix(`${arrayPath}.`, path), paths),
    getArrayOfObjectsPathsMap(schema)
  )

  /*
  Assumming "library.books" is an array field and "person.name" is a regular
  field:
  const grouped = {
    "person.name": true,
    "library.books": ["title", "author"]
  }
  */
  const grouped = _.reduce(
    (acc, path) => {
      const arrayPath = findByPrefix(path, _.keys(arrayOfObjectsPaths))
      const itemPath = removePrefix(`${arrayPath}.`, path)
      if (!arrayPath || arrayPath === path) {
        acc[path] = true
      }
      if (arrayPath && acc[arrayPath] !== true) {
        acc[arrayPath] ??= []
        acc[arrayPath].push(itemPath)
      }
      if (areArraysEqual(acc[arrayPath], arrayOfObjectsPaths[arrayPath])) {
        acc[arrayPath] = true
      }
      return acc
    },
    {},
    paths
  )

  const removePathsFromArray = (paths) => (arr) =>
    _.reduce(
      (acc, item) => {
        for (const path of paths) {
          F.unsetOn(path, item)
        }
        return _.isEmpty(item) ? acc : F.push(item, acc)
      },
      [],
      arr
    )

  for (const [field, paths] of _.toPairs(grouped)) {
    if (paths === true) {
      F.unsetOn(field, hit._source)
    } else {
      F.updateOn(field, removePathsFromArray(paths), hit._source)
      if (_.isEmpty(_.get(field, hit._source))) {
        F.unsetOn(field, hit._source)
      }
    }
  }
}

export const wrapSearch = (node, search, schema) => async (body) => {
  const tags = { pre: '<b class="search-highlight">', post: '</b>' }

  const addedPaths = addPathsToSource(
    schema,
    body,
    // Paths for all fields we'd like to retrieve no matter what.
    // Currently only paths for fields in arrays of objects.
    _.flatten(_.values(getArrayOfObjectsPathsMap(schema)))
  )
  const response = await search({
    ...body,
    highlight: {
      pre_tags: [tags.pre],
      post_tags: [tags.post],
      number_of_fragments: 0,
      fields: getHighlightFields(schema, node),
    },
  })
  for (const hit of response.hits.hits) {
    transformResponseHighlight(schema, hit, tags, node.highlight.arrayIncludes)
    removePathsFromSource(schema, hit, addedPaths)
    mergeHighlightsOnSource(schema, hit)
  }
  return response
}
