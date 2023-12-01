import _ from 'lodash/fp.js'
import F from 'futil'
import { CartesianProduct } from 'js-combinatorics'
import { isLeafField, isBlobField } from './util.js'

// Names of all subfields that can be highlighted.
const getHighlightSubFieldsNames = (schema) =>
  _.keys(_.pickBy('highlight', schema.elasticsearch?.subFields))

// Paths of all fields groups and their subfields in a schema that can be highlighted.
export const getHighlightFieldsGroupsPaths = _.memoize((schema) => {
  const subFieldsNames = getHighlightSubFieldsNames(schema)
  return _.flatMap((field) => {
    const copy_to = field.elasticsearch?.copy_to
    if (!_.isEmpty(copy_to)) {
      const product = new CartesianProduct(copy_to, subFieldsNames)
      return [...copy_to, ..._.map(_.join('.'), Array.from(product))]
    }
    return copy_to ?? []
  }, schema.fields)
}, _.get('elasticsearch.index'))

// Object of all fields and their subfields in a schema that can be highlighted.
export const getAllHighlightFields = _.memoize((schema) => {
  const subFieldsNames = getHighlightSubFieldsNames(schema)
  const groupsPaths = getHighlightFieldsGroupsPaths(schema)
  const isFieldsGroupPath = (path) => _.includes(path, groupsPaths)
  return F.reduceIndexed(
    (acc, field, path) => {
      if (!isLeafField(field) || isFieldsGroupPath(path)) {
        return acc
      }
      acc[path] = field
      const subFieldsMappings = _.pick(
        subFieldsNames,
        field.elasticsearch.fields
      )
      for (const name in subFieldsMappings) {
        acc[`${path}.${name}`] = {
          elasticsearch: {
            ...subFieldsMappings[name],
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

export const getHighlightFields = (schema, node) => {
  const query = node._meta?.relevantFilters
  const querystr = JSON.stringify(query)
  const groupsPaths = getHighlightFieldsGroupsPaths(schema)

  // Pre-computed list of fields groups present in the query
  const queryFieldsGroups = F.reduceTree()(
    (acc, val, key) =>
      _.includes(val, groupsPaths)
        ? F.push(val, acc)
        : _.includes(key, groupsPaths)
        ? F.push(key, acc)
        : acc,
    [],
    query
  )

  const getHighlightQuery = (field, path) => {
    const pathsToReplace = _.intersection(
      queryFieldsGroups,
      field.elasticsearch?.copy_to
    )
    if (!_.isEmpty(pathsToReplace)) {
      const regexp = new RegExp(_.join('|', pathsToReplace), 'g')
      return JSON.parse(_.replace(regexp, path, querystr))
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
