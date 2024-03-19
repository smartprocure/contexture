import _ from 'lodash/fp.js'
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
    (string) => words(string, wordsMatchPattern),
    _.take(maxWordsPerTag),
    _.map((word) =>
      _.flow(
        _.truncate({ length: maxCharsPerTagWord, omission: '' }),
        // Remove beginning of line dash and space dash
        _.replace(/^-| -/g, ' '),
        _.trim
      )(word)
    ),
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

export let wordRegex = /[-\w]+/g
export let wordRegexWithDot = /[-.\w]+/g
