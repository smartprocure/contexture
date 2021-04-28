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

// Take tags and call fn if we actually took less than the total
export let takeTags = (maxTags, fn) => tags => {
  if (maxTags < _.size(tags)) {
    F.maybeCall(fn, maxTags, tags)
  }
  return _.take(maxTags, tags)
}
