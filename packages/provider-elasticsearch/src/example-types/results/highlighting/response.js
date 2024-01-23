import _ from 'lodash/fp.js'
import F from 'futil'
import { groupByIndexed } from '../../../utils/futil.js'
import {
  stripTags,
  mergeHighlights,
  isBlobField,
  isArrayField,
  isArrayOfScalarsField,
  findByPrefixIn,
  isArrayOfObjectsField,
  getNestedPathsMap,
  stripParentPath,
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
 * Group nested fields under their parent array of objects path.
 */
export let groupByArrayOfObjectsFields = _.curry((schema, highlight) => {
  let arrayOfObjectsPaths = _.keys(getArrayOfObjectsPathsMap(schema))
  return F.reduceIndexed(
    (acc, fragments, path) => {
      let arrayPath = findByPrefixIn(arrayOfObjectsPaths, path)
      if (arrayPath) {
        let nestedPath = stripParentPath(arrayPath, path)
        return _.update([arrayPath], _.set([nestedPath], fragments), acc)
      }
      return _.set([path], fragments, acc)
    },
    {},
    highlight
  )
})

/**
 * Convert an array of fragments to an object where keys are corresponding
 * indexes in source array and values are fragments.
 */
export let getIndexedFragments = (tags, source, fragments, nestedPath) => {
  let fragmentsMap = _.groupBy(stripTags(tags), fragments)
  return F.reduceIndexed(
    (acc, item, index) => {
      let value = F.getOrReturn(nestedPath, item)
      return _.has(value, fragmentsMap)
        ? F.setOn(index, fragmentsMap[value], acc)
        : acc
    },
    {},
    source
  )
}

let getIndexedAndMergedFragments = (tags, source, fragments, nestedPath) =>
  _.mapValues(
    mergeHighlights(tags),
    getIndexedFragments(tags, source, fragments, nestedPath)
  )

export let getArrayOfScalarsFragments = getIndexedAndMergedFragments

/**
 * Ex: `{ "cover.title": [...] }` -> `{ 0: { cover: { title: [...] } } }`
 *
 * See tests for more details.
 */
export let getArrayOfObjectsFragments = (tags, source, fragmentsMap) =>
  _.mergeAll(
    F.mapIndexed(
      (fragments, nestedPath) =>
        _.mapValues(
          (merged) => _.set(nestedPath, merged, {}),
          getIndexedAndMergedFragments(tags, source, fragments, nestedPath)
        ),
      fragmentsMap
    )
  )

/**
 * Get hit `highlight`:
 * 1. Fragments for text fields get merged.
 * 2. Fragments for large (blob) text fields get concatenated.
 * 3. Fragments for arrays get ordered based on the source array
 */
export let getResponseHighlight = (schema, hit, tags, copySourcePaths) => {
  let pathsMap = getNestedPathsMap(schema, copySourcePaths)
  return _.flow(
    groupByMultiField(schema),
    _.mapValues(_.flatten),
    groupByArrayOfObjectsFields(schema),
    F.mapValuesIndexed((fragments, path) => {
      let field = schema.fields[path]

      if (isBlobField(field)) {
        return fragments
      }

      if (isArrayOfScalarsField(field)) {
        let sourceArray = _.get(path, hit._source)
        return getArrayOfScalarsFragments(tags, sourceArray, fragments)
      }

      if (isArrayOfObjectsField(field)) {
        let sourceArray = _.get(path, hit._source)
        let result = getArrayOfObjectsFragments(tags, sourceArray, fragments)
        let copyPaths = pathsMap[path]
        if (_.isEmpty(copyPaths)) return result
        return F.mapValuesIndexed(
          (to, index) => _.merge(_.pick(copyPaths, sourceArray[index]), to),
          result
        )
      }

      return mergeHighlights(tags, fragments)
    })
  )(hit.highlight)
}

/**
 * Remove each path in `paths` from `hit._source`.
 *
 * This function is more complicated than a simple `filterTree` because it
 * needs to be performant since it runs on every hit and may potentially have to
 * recurse into large source values.
 */
export let removePathsFromSource = (schema, hit, paths) => {
  if (_.isEmpty(paths)) return

  let unsetAllPaths = _.curry((paths, obj) => {
    for (let path of paths) F.unsetOn(path, obj)
    return obj
  })

  let allNestedPaths = getArrayOfObjectsPathsMap(schema)

  for (let [path, nested] of _.toPairs(getNestedPathsMap(schema, paths))) {
    let shouldRemovePath =
      _.isEmpty(nested) || _.isEqual(nested, allNestedPaths[path])

    if (!shouldRemovePath) {
      // Remove paths from each item in the array.
      F.updateOn(path, _.map(unsetAllPaths(nested)), hit._source)
      // Remove empty array items.
      F.updateOn(path, _.remove(_.isEmpty), hit._source)
      // If the array itself is empty, remove it.
      shouldRemovePath = _.isEmpty(_.get(path, hit._source))
    }

    if (shouldRemovePath) {
      F.unsetOn(path, hit._source)
    }
  }
}

/*
 * Merge elastic hit highlights onto hit source.
 *
 * On 100 hits each with an array of about 10,000 items this implementation is
 * ~100x faster than a mutating lodash `_.merge`.
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
