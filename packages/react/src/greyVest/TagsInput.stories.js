import _ from 'lodash/fp.js'
import React from 'react'
import TagsInput from './TagsInput.js'

export default {
  component: TagsInput,
}

export const Default = () => {
  let [tags, setTags] = React.useState([
    'janitor',
    'soap',
    'cleaner',
    'cleaning',
    'clean',
  ])
  return (
    <TagsInput
      tags={tags}
      addTags={(tags) => setTags((current) => _.union(tags, current))}
      removeTag={(tag) => setTags((current) => _.pull(tag, current))}
      tagStyle={{ background: 'lavender' }}
    />
  )
}
