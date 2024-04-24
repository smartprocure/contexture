import _ from 'lodash/fp.js'
import F from 'futil'

export let openBinding = (...lens) => ({
  isOpen: F.view(...lens),
  onClose: F.off(...lens),
})

let maxWordsPerTag = 100
let maxCharsPerTagWord = 100

// Strip these characters when splitting a tag into words. We do this to display
// tags that are closer to what we send to elastic in a `query_string` query.
//
// See https://github.com/smartprocure/contexture-elasticsearch/pull/170
//
// If in doubt, make a request to the `/{index}/analyze` elasticsearch endpoint
// to see exactly which characters get stripped out of text.
let wordRegex = /[^|!(){}[\]^"~*?\\<>;,$']+/g
let words = _.words.convert({ fixed: false })

// Convert string to words, take the first maxWordsPerTag, truncate them and convert back to string
export let sanitizeQueryStringTag = _.flow(
  (string) => words(string, wordRegex),
  _.take(maxWordsPerTag),
  _.map((word) =>
    _.flow(
      _.truncate({ length: maxCharsPerTagWord, omission: '' }),
      // Remove beginning of line dash and space dash
      // https://github.com/smartprocure/spark/issues/10923
      _.replace(/^-| -/g, ' '),
      _.trim
    )(word)
  ),
  _.join(' ')
)

// Split a tag on comma into unique words
let splitTagOnComma = _.flow(
  _.split(','),
  _.invokeMap('trim'),
  _.compact,
  _.uniq
)

export let createTags = ({ input, splitCommas, sanitizeTagFn }) =>
  _.flow(
    _.trim,
    splitCommas ? splitTagOnComma : _.identity,
    _.castArray,
    sanitizeTagFn ? _.map(sanitizeTagFn) : _.identity
  )(input)
