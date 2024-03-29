import _ from 'lodash/fp.js'
import { bgJoin } from '../../styles/generic.js'
import { tagToGroupJoin } from '../TagsJoinPicker.js'

export let tagTerm = 'keyword'
export let tagValueField = 'word'

export let copyTags = (node) => {
  if (node.tags) {
    let words = _.flow(_.map(tagValueField), _.reverse, _.join(','))(node.tags)
    navigator.clipboard.writeText(words)
  }
}

export let getTag = (tag, node = {}, key = tagValueField) =>
  _.find({ [key]: tag }, node.tags) || {}

// TagsInput expects a `tagStyle` prop, which is a function of `tag`
export let getTagStyle = (node, key) => (tag) => {
  let tagInstance = getTag(tag, node, key)
  return {
    ...(tagInstance.distance ? {} : { fontWeight: 'bold' }),
    ...bgJoin(tagToGroupJoin(_.get('join', node))),
    opacity:
      tagInstance.onlyShowTheseResults ||
      !_.find('onlyShowTheseResults', node.tags)
        ? 1
        : 0.5,
  }
}

export let convertWordToTag = (word, label = '') => ({
  [tagValueField]: word,
  label,
  distance: 3,
})
