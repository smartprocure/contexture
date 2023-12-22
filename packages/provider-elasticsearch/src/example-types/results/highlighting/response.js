import _ from 'lodash/fp.js'
import F from 'futil'
import { isArraysEqual, groupByIndexed } from '../../../utils/futil.js'
import {
  stripTags,
  mergeHighlights,
  isBlobField,
  isArrayField,
  isArrayOfScalarsField,
  findByPrefix,
  getArrayOfObjectsPathsMap,
} from './util.js'

let lastWordRegex = /\.(\w+)$/

/*
 * Group highlight results by their multifield. For example `city` and
 * `city.subfield` will be grouped under `city`.
 */
let groupByMultiField = _.curry((schema, highlight) =>
  groupByIndexed((v, path) => {
    let [multi, sub] = path.split(lastWordRegex)
    return schema.fields[multi]?.elasticsearch?.mapping?.fields?.[sub]
      ? multi
      : path
  }, highlight)
)

/**
 * Mutate hit `highlight`:
 * 1. Fragments for text fields get merged.
 * 2. Fragments for large (blob) text fields get concatenated.
 * 3. Fragments for arrays get ordered based on the source array
 */
export let transformResponseHighlight = (
  schema,
  hit,
  tags,
  nestedArrayIncludes = {}
) => {
  let arrayOfObjectsPaths = _.keys(getArrayOfObjectsPathsMap(schema))

  let getIndexedArrayObject = (arr, fragments, arrayPath, itemPath) => {
    let fragmentsMap = _.groupBy(stripTags(tags), fragments)
    return F.reduceIndexed(
      (acc, item, index) => {
        let fragments = fragmentsMap[itemPath ? _.get(itemPath, item) : item]
        if (fragments) {
          F.setOn(
            F.dotJoin([`${index}`, itemPath]),
            mergeHighlights(tags, ...fragments),
            acc
          )
          for (let itemPath of nestedArrayIncludes[arrayPath] ?? []) {
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

  let getArrayPath = (path) =>
    isArrayOfScalarsField(schema.fields[path])
      ? path
      : findByPrefix(path, arrayOfObjectsPaths)

  let highlight = _.flow(
    groupByMultiField(schema),
    _.mapValues(_.flatten),
    F.reduceIndexed((acc, fragments, path) => {
      let arrayPath = getArrayPath(path)
      if (arrayPath) {
        acc[arrayPath] = getIndexedArrayObject(
          acc[arrayPath] ?? {},
          fragments,
          arrayPath,
          path.slice(arrayPath.length + 1)
        )
      } else if (isBlobField(schema.fields[path])) {
        acc[path] = fragments
      } else {
        acc[path] = mergeHighlights(tags, ...fragments)
      }
      return acc
    }, {})
  )(hit.highlight)

  if (!_.isEmpty(highlight)) hit.highlight = highlight
}

/**
 * Remove each path in `paths` from `hit._source`.
 */
export let removePathsFromSource = (schema, hit, paths) => {
  // Nothing to do
  if (_.isEmpty(paths)) return

  // "aoo" stands for "array of objects", because I was tired of typing it out
  // over and over again.
  let aooMap = getArrayOfObjectsPathsMap(schema)
  let allAooPaths = _.keys(aooMap)
  let getAooPath = (path) => findByPrefix(path, allAooPaths)
  let [aooPaths, otherPaths] = _.partition(getAooPath, paths)

  let toRemove = {
    ...F.arrayToObject(_.identity, _.constant(true), otherPaths),
    ...F.mapValuesIndexed((paths, aooPath) => {
      let removeEntireArray =
        // All nested fields in array of objects should be removed
        isArraysEqual(paths, aooMap[aooPath]) ||
        // Or... the path for the array of objects field should be removed
        _.includes(aooPath, paths)
      return (
        removeEntireArray ||
        _.map((path) => path.slice(aooPath.length + 1), paths)
      )
    }, _.groupBy(getAooPath, aooPaths)),
  }

  let removePathsFromArray = (paths) => (arr) =>
    _.reduce(
      (acc, item) => {
        for (let path of paths) F.unsetOn(path, item)
        return _.isEmpty(item) ? acc : F.push(item, acc)
      },
      [],
      arr
    )

  for (let [path, value] of _.toPairs(toRemove)) {
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
export let mergeHighlightsOnSource = (schema, hit) => {
  for (let path in hit.highlight) {
    let fragments = hit.highlight[path]
    let field = schema.fields[path]

    // Set highlight fragments on source.
    if (!isArrayField(field)) {
      F.setOn(path, fragments, hit._source)
      continue
    }

    // Array fragments get transformed into an object where keys are array
    // indexes from the source array so this function can stay performant.
    hit.highlight[path] = _.values(fragments)
    let sourceArray = _.get(path, hit._source)

    // There is no source array so just set highlight fragments on source.
    if (!sourceArray) {
      F.setOn(path, hit.highlight[path], hit._source)
      continue
    }

    // Set each fragment on the correct index in the source array.
    for (let index in fragments) {
      if (isArrayOfScalarsField(field)) {
        sourceArray[index] = fragments[index]
      } else {
        F.mergeOn(sourceArray[index], fragments[index])
      }
    }
  }
}
