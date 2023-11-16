import _ from 'lodash/fp.js'
import F from 'futil'

export const getArrayFieldsPaths = _.memoize(
  (schema) =>
    _.keys(
      _.pickBy({ elasticsearch: { meta: { subType: 'array' } } }, schema.fields)
    ),
  _.get('elasticsearch.index')
)

/**
 * Returns an array of [start, end] ranges that correspond to substrings
 * enclosed in pre/post tags. The ranges correspond to the plain string without
 * tags. For example given the tags `{ pre: '<em>', post: '</em>' }`, this
 * function will return [[2, 5], [6, 9]] for the string
 *
 * `A <em>red</em> <em>car</em>`
 */
const getHighlightRanges = (pre, post, str) => {
  let runningTagsLength = 0
  const ranges = []
  const regexp = new RegExp(`${pre}(?<capture>.*?)${post}`, 'g')
  for (const match of str.matchAll(regexp)) {
    const start = match.index - runningTagsLength
    const end = start + match.groups.capture.length
    ranges.push([start, end])
    runningTagsLength += pre.length + post.length
  }
  return ranges
}

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

export const mergeHighlights = (config, ...strs) => {
  // This may look unnecessary but merging highlights is not cheap and many
  // times is not even needed
  if (_.size(strs) <= 1) return _.head(strs)
  const { pre_tag: pre, post_tag: post } = config
  const ranges = F.mergeRanges(
    _.flatMap((str) => getHighlightRanges(pre, post, str), strs)
  )
  return highlightFromRanges(
    pre,
    post,
    ranges,
    _.head(strs).replaceAll(pre, '').replaceAll(post, '')
  )
}
