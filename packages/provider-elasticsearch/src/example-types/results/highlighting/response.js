import _ from 'lodash/fp.js'
import F from 'futil'
import { removePrefix, groupByIndexed } from '../../../utils/futil.js'
import {
  stripTags,
  mergeHighlights,
  isBlobField,
  isArrayOfScalarsField,
  findByPrefix,
  getArrayOfObjectsPathsMap,
} from './util.js'

const lastWordRegex = /\.(\w+)$/

const getMultiFieldName = (schema, field) => {
  const [multi, sub] = field.split(lastWordRegex)
  return schema.fields[multi]?.elasticsearch?.fields?.[sub] ? multi : field
}

export const transformResponseHighlight = (
  schema,
  hit,
  tags,
  arrayIncludes = {}
) => {
  const arrayOfObjectsPaths = _.keys(getArrayOfObjectsPathsMap(schema))

  // Group `city` and `city.subfield` under `city`
  const grouped = _.flow(
    groupByIndexed((v, k) => getMultiFieldName(schema, k)),
    _.mapValues(_.flatten)
  )(hit.highlight)

  hit.highlight = F.reduceIndexed(
    (acc, fragments, path) => {
      const field = schema.fields[path]
      const arrayPath = isArrayOfScalarsField(field)
        ? path
        : findByPrefix(path, arrayOfObjectsPaths)

      if (arrayPath) {
        const itemPath = removePrefix(`${arrayPath}.`, path)
        const fragmentsMap = _.groupBy(
          (fragment) => stripTags(tags, fragment),
          fragments
        )
        const sourceArray = _.get(arrayPath, hit._source)
        for (const index in sourceArray) {
          const lookupKey = itemPath
            ? _.get(itemPath, sourceArray[index])
            : sourceArray[index]
          const fragments = fragmentsMap[lookupKey]
          if (fragments) {
            acc[arrayPath] ??= {}
            F.setOn(
              F.dotJoin([index, itemPath]),
              mergeHighlights(tags, ...fragments),
              acc[arrayPath]
            )
            for (const itemPath of arrayIncludes[arrayPath] ?? []) {
              F.updateOn(
                F.dotJoin([index, itemPath]),
                (highlight) => highlight ?? _.get(itemPath, sourceArray[index]),
                acc[arrayPath]
              )
            }
          }
        }
      } else if (isBlobField(schema.fields[path])) {
        acc[path] = fragments
      } else {
        acc[path] = mergeHighlights(tags, ...fragments)
      }

      return acc
    },
    {},
    grouped
  )
}
