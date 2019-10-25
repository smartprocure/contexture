import _ from 'lodash/fp'
import { bgJoin } from '../styles/generic'
import { tagToGroupJoin } from '../exampleTypes/TagsJoinPicker'

export let getTag = (tag, node = {}, key) => key ? _.find({ [key]: tag }, node.tags) : key

// TagsInput expects a `tagStyle` prop, which is a function of `tag`
export let getTagStyle = (node, key) => tag => {
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