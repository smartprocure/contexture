import _ from 'lodash/fp'
import F from 'futil'

export let openBinding = (...lens) => ({
  isOpen: F.view(...lens),
  onClose: F.off(...lens),
})

// Convert string to words, take the first maxWordsPerTag, truncate them and convert back to string
export let sanitizeTagWords = (
  wordsMatchPattern,
  maxWordsPerTag,
  maxCharsPerTagWord
) => {
  let words = _.words.convert({ fixed: false })
  return _.flow(
    string => words(string, wordsMatchPattern),
    _.take(maxWordsPerTag),
    _.map(_.truncate({ length: maxCharsPerTagWord, omission: '' })),
    _.join(' ')
  )
}

// Split a tag on comma into unique words
export let splitTagOnComma = _.flow(
  _.trim,
  _.split(','),
  _.invokeMap('trim'),
  _.compact,
  _.uniq
)

// RegEx to match words composed of alphanumeric characters.
// Uses ASCI ranges https://donsnotes.com/tech/charsets/ascii.html
// From: https://github.com/lodash/lodash/blob/ddfd9b11a0126db2302cb70ec9973b66baec0975/lodash.js#L166
// eslint-disable-next-line no-control-regex
export let alphaNumericRegEx = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g
