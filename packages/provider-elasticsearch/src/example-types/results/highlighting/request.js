import _ from 'lodash/fp.js'
import F from 'futil'
import { minimatch } from 'minimatch'
import { getFieldType, isBlobField, isArrayOfObjectsField } from './util.js'

/*
 * Expand schema paths with wildcards into a list of paths without wildcards.
 * Paths for arrays of objects get expanded into its nested field paths. For
 * example if `friends` is an array of people, it gets expanded into
 * `[friends.name, friends.height, ...]`
 */
let expandGlobs = (schema, globs) => {
  let fieldsNames = _.keys(schema.fields)

  let expandGlob = (glob) =>
    getFieldType(schema.fields[glob])
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
 * Returns object with source includes, excludes, and added paths.
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

/**
 * Returns field's subfields, each mapped to a structure similar to a top level
 * field.
 */
let getFieldSubFields = (field) =>
  F.mapValuesIndexed(
    (subField, subFieldName) =>
      F.omitBlank({
        // Reuse the parent multi-field `subType` so that we can generate the
        // correct highlighting configuration.
        subType: field.subType,
        elasticsearch: F.omitBlank({
          mapping: F.omitBlank({
            ...subField,
            copy_to: _.map(
              (path) => `${path}.${subFieldName}`,
              field.elasticsearch.mapping?.copy_to
            ),
          }),
        }),
      }),
    field.elasticsearch?.mapping?.fields
  )

/**
 * Returns object of all subfields in a schema.
 */
let getSchemaSubFields = (schema) => {
  let acc = {}
  for (let path in schema.fields) {
    let subFields = getFieldSubFields(schema.fields[path])
    for (let k in subFields) {
      acc[`${path}.${k}`] = subFields[k]
    }
  }
  return acc
}

/**
 * Returns object of all group fields and their subfields in a schema.
 */
let getSchemaGroupFields = _.memoize((schema) => {
  let groupFields = _.pick(
    _.uniq(
      _.flatMap(
        (field) => field.elasticsearch?.mapping?.copy_to ?? [],
        schema.fields
      )
    ),
    schema.fields
  )
  return {
    ...groupFields,
    ...getSchemaSubFields({ fields: groupFields }),
  }
}, _.get('elasticsearch.index'))

/*
 * Return object of all fields and their subfields that can be highlighted.
 */
export let getAllHighlightFields = _.memoize((schema) => {
  let groupFields = getSchemaGroupFields(schema)

  let canHighlightField = (field, path) =>
    // Only highlight text fields.
    getFieldType(field) === 'text' &&
    // Omit group fields from highlighting. We assume users want to
    // highlight fields that were copied over instead of the group fields
    // themselves.
    !_.has(path, groupFields)

  return F.pickByIndexed(canHighlightField, {
    ...schema.fields,
    ...getSchemaSubFields(schema),
  })
}, _.get('elasticsearch.index'))

let collectKeysAndValues = (predicate, coll) => {
  let acc = []
  F.walk()((val, key) => {
    if (predicate(val)) acc.push(val)
    else if (predicate(key)) acc.push(key)
  })(coll)
  return acc
}

let blobConfiguration = {
  fragment_size: 250,
  number_of_fragments: 3,
}

/*
 * Get configuration for highlight fields to send in the elastic request.
 */
export let getRequestHighlightFields = (schema, node) => {
  let groupFields = getSchemaGroupFields(schema)

  let groupFieldsInQuery = collectKeysAndValues(
    F.getIn(groupFields),
    node._meta?.relevantFilters
  )

  // Stringifying once and then replacing paths and parsing the query again is
  // more performant than walking the query.
  let queryStr = JSON.stringify(node._meta?.relevantFilters)

  let getHighlightQuery = (field, path) => {
    let pathsToReplace = _.intersection(
      groupFieldsInQuery,
      field.elasticsearch?.mapping?.copy_to
    )
    if (!_.isEmpty(pathsToReplace)) {
      let regexp = new RegExp(_.join('|', pathsToReplace), 'g')
      return JSON.parse(_.replace(regexp, path, queryStr))
    }
  }

  let highlightFields = getAllHighlightFields(schema)

  // TODO: `highlightOtherMatches` is an undocumented configuration value that we
  // are currently using to work around performance issues when highlighting
  // fields not included in the node.
  if (!node.highlight?.highlightOtherMatches && _.isArray(node.include)) {
    let subFields = getSchemaSubFields({
      fields: _.pick(node.include, schema.fields),
    })
    highlightFields = _.pick(
      _.uniq([...node.include, ..._.keys(subFields)]),
      highlightFields
    )
  }

  return F.mapValuesIndexed(
    (field, path) =>
      F.omitBlank({
        ...(isBlobField(field) && blobConfiguration),
        highlight_query: getHighlightQuery(field, path),
      }),
    highlightFields
  )
}
