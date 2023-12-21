import _ from 'lodash/fp.js'
import F from 'futil'
import {
  removePrefix,
  areArraysEqual,
  groupByIndexed,
} from '../../../utils/futil.js'
import {
  stripTags,
  mergeHighlights,
  isBlobField,
  isArrayField,
  isArrayOfScalarsField,
  findByPrefix,
  getArrayOfObjectsPathsMap,
} from './util.js'

const lastWordRegex = /\.(\w+)$/

/*
 * Group highlight results by their multifield. For example `city` and
 * `city.subfield` will be grouped under `city`.
 */
const groupByMultiField = _.curry((schema, highlight) =>
  groupByIndexed((v, path) => {
    const [multi, sub] = path.split(lastWordRegex)
    return schema.fields[multi]?.elasticsearch?.fields?.[sub] ? multi : path
  }, highlight)
)

export const transformResponseHighlight = (
  schema,
  hit,
  tags,
  arrayIncludes = {}
) => {
  const arrayOfObjectsPaths = _.keys(getArrayOfObjectsPathsMap(schema))

  const getIndexedArrayObject = (arr, fragments, arrayPath, itemPath) => {
    const fragmentsMap = _.groupBy(stripTags(tags), fragments)
    return F.reduceIndexed(
      (acc, item, index) => {
        const fragments = fragmentsMap[itemPath ? _.get(itemPath, item) : item]
        if (fragments) {
          F.setOn(
            F.dotJoin([`${index}`, itemPath]),
            mergeHighlights(tags, ...fragments),
            acc
          )
          for (const itemPath of arrayIncludes[arrayPath] ?? []) {
            F.updateOn(
              F.dotJoin([`${index}`, itemPath]),
              (highlight) => highlight ?? _.get(itemPath, item),
              acc
            )
          }
        }
        return acc
      },
      arr,
      _.get(arrayPath, hit._source)
    )
  }

  const getArrayPath = (path) =>
    isArrayOfScalarsField(schema.fields[path])
      ? path
      : findByPrefix(path, arrayOfObjectsPaths)

  hit.highlight = _.flow(
    groupByMultiField(schema),
    _.mapValues(_.flatten),
    F.reduceIndexed((acc, fragments, path) => {
      const arrayPath = getArrayPath(path)
      if (arrayPath) {
        acc[arrayPath] = getIndexedArrayObject(
          acc[arrayPath] ?? {},
          fragments,
          arrayPath,
          removePrefix(`${arrayPath}.`, path)
        )
      } else if (isBlobField(schema.fields[path])) {
        acc[path] = fragments
      } else {
        acc[path] = mergeHighlights(tags, ...fragments)
      }
      return acc
    }, {})
  )(hit.highlight)
}

export const removePathsFromSource = (schema, hit, paths) => {
  // Nothing to do
  if (_.isEmpty(paths)) return

  // "aoo" stands for "array of objects", because I was tired of typing all of
  // that out every time.
  const aooMap = getArrayOfObjectsPathsMap(schema)
  const aooPaths = _.keys(aooMap)
  const getAooPath = (path) => findByPrefix(path, aooPaths)
  const [arrayPaths, normalPaths] = _.partition(getAooPath, paths)
  const toRemove = {
    ...F.arrayToObject(_.identity, _.constant(true), normalPaths),
    ...F.mapValuesIndexed(
      (paths, aooPath) =>
        areArraysEqual(paths, aooMap[aooPath]) || _.includes(aooPath, paths)
          ? true
          : _.map(removePrefix(`${aooPath}.`), paths),
      _.groupBy(getAooPath, arrayPaths)
    ),
  }

  const removePathsFromArray = (paths) => (arr) =>
    _.reduce(
      (acc, item) => {
        for (const path of paths) F.unsetOn(path, item)
        return _.isEmpty(item) ? acc : F.push(item, acc)
      },
      [],
      arr
    )

  for (const [path, value] of _.toPairs(toRemove)) {
    if (value === true) {
      F.unsetOn(path, hit._source)
    } else {
      F.updateOn(path, removePathsFromArray(value), hit._source)
      if (_.isEmpty(_.get(path, hit._source))) {
        F.unsetOn(path, hit._source)
      }
    }
  }
}

/*
 * Merge elastic hit highlights onto hit source.
 *
 * As a clever developer, you will notice that the following function is a dirty
 * and unholy version `_.merge`. So before you refactor it to use exactly that,
 * consider that this implementation is about 100x faster than (immutable)
 * `_.merge`. Query 100 records with arrays of thousands of elements each and
 * convince yourself.
 */
export const mergeHighlightsOnSource = (schema, hit) => {
  for (const path in hit.highlight) {
    const fragments = hit.highlight[path]
    const field = schema.fields[path]

    // Set highlight fragments on source.
    if (!isArrayField(field)) {
      F.setOn(path, fragments, hit._source)
      continue
    }

    // Array fragments get transformed into an object where keys are array
    // indexes from the source array so this function can stay performant.
    hit.highlight[path] = _.values(fragments)
    const sourceArray = _.get(path, hit._source)

    // There is no source array so just set highlight fragments on source.
    if (!sourceArray) {
      F.setOn(path, hit.highlight[path], hit._source)
      continue
    }

    // Set each fragment on the correct index in the source array.
    for (const index in fragments) {
      if (isArrayOfScalarsField(field)) {
        sourceArray[index] = fragments[index]
      } else {
        F.mergeOn(sourceArray[index], fragments[index])
      }
    }
  }
}
