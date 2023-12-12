import _ from 'lodash/fp.js'
import F from 'futil'

export const findByPrefix = (str, arr) =>
  _.find((k) => _.startsWith(k, str), arr)

export const isLeafField = (field) => !!field?.elasticsearch?.dataType

export const isBlobField = (field) =>
  field?.elasticsearch?.meta?.subType === 'blob' && isLeafField(field)

export const isArrayField = (field) =>
  field?.elasticsearch?.meta?.subType === 'array'

export const isArrayOfScalarsField = (field) =>
  isArrayField(field) && isLeafField(field)

export const isArrayOfObjectsField = (field) =>
  isArrayField(field) && !isLeafField(field)

// Object keys are paths of arrays of objects fields in the schema and values
// are lists of paths for fields under each array field.
export const getArrayOfObjectsPathsMap = _.memoize((schema) => {
  const fieldsPaths = _.keys(schema.fields)
  return F.reduceIndexed(
    (acc, field, arrayPath) => {
      if (isArrayOfObjectsField(field)) {
        acc[arrayPath] = _.filter(_.startsWith(`${arrayPath}.`), fieldsPaths)
      }
      return acc
    },
    {},
    schema.fields
  )
}, _.get('elasticsearch.index'))

export const stripTags = _.curry((tags, str) =>
  str.replaceAll(tags.pre, '').replaceAll(tags.post, '')
)

const getRangesRegexp = _.memoize(
  (tags) => new RegExp(`${tags.pre}(?<capture>.*?)${tags.post}`, 'g')
)

/**
 * Returns an array of [start, end] ranges that correspond to substrings
 * enclosed in pre/post tags. The ranges correspond to the plain string without
 * tags. For example given the tags `{ pre: '<em>', post: '</em>' }`, this
 * function will return [[2, 5], [6, 9]] for the string
 *
 * `A <em>red</em> <em>car</em>`
 */
const getHighlightRanges = _.curry((tags, str) => {
  let runningTagsLength = 0
  const ranges = []
  for (const match of str.matchAll(getRangesRegexp(tags))) {
    const start = match.index - runningTagsLength
    const end = start + match.groups.capture.length
    ranges.push([start, end])
    runningTagsLength += match[0].length - match[1].length
  }
  return ranges
})

/**
 * Wrap substrings given by [start, end] ranges with pre/post tags
 *
 * This function could extend `F.highlight` functionality to accept ranges. For
 * example:
 *
 * ```javascript
 * const braceHighlight = F.highlight("{", "}")
 * braceHighlight([[2, 4], [9, 10]], "hello world") // -> "he{llo} wor{ld}"
 * ````
 */
const highlightFromRanges = (pre, post, ranges, str) => {
  const starts = _.fromPairs(_.map((x) => [x[0]], ranges))
  const ends = _.fromPairs(_.map((x) => [x[1]], ranges))
  const highlighted = str.replace(/./g, (match, index) => {
    if (index in starts) return `${pre}${match}`
    if (index in ends) return `${post}${match}`
    return match
  })
  // Sometimes the last word is highlighted so the index for the last tag is
  // `str.length` but `replace` only makes it up to `str.length - 1`.
  return _.last(_.last(ranges)) === str.length
    ? `${highlighted}${post}`
    : highlighted
}

export const mergeHighlights = (tags, ...strs) => {
  // This may look unnecessary but merging highlights is not cheap and many
  // times is not even needed
  if (strs.length <= 1) return _.head(strs)
  const ranges = F.mergeRanges(_.flatMap(getHighlightRanges(tags), strs))
  return highlightFromRanges(
    tags.pre,
    tags.post,
    ranges,
    stripTags(tags, _.head(strs))
  )
}
