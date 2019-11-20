import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { contexturify } from '../utils/hoc'
import { bgJoin } from '../styles/generic'

import TagsJoinPicker, { tagToGroupJoin } from './TagsJoinPicker'

let operatorOptions = F.autoLabelOptions([
  { value: 'containsWord', label: 'Field Contains' },
  { value: 'wordStartsWith', label: 'Word Starts With' },
  { value: 'wordEndsWith', label: 'Word Ends With' },
  { value: 'containsExact', label: 'Word Is Exactly' },
  { value: 'startsWith', label: 'Field Starts With' },
  { value: 'endsWith', label: 'Field Ends With' },
  { value: 'is', label: 'Field Is Exactly' },
  // { value: 'isNot', label: 'Is Not' },
  // { value: 'contains', label: 'Contains'},
  // { value: 'doesNotContain', label: 'Does Not Contain'}
])

let Text = ({
  tree,
  node,
  placeholder,
  theme: { Select, TagsInput, Popover },
}) => {
  let open = React.useState(false)
  let [selectedTag, setSelectedTag] = React.useState(null)
  return (
    <div className="contexture-text">
      <Select
        value={node.operator}
        onChange={e => tree.mutate(node.path, { operator: e.target.value })}
        options={operatorOptions}
      />
      <TagsInput
        splitCommas
        tags={node.values}
        onTagClick={tag => {
          F.on(open)()
          setSelectedTag(tag)
        }}
        addTag={tag => {
          tree.mutate(node.path, { values: [...node.values, tag] })
        }}
        removeTag={tag => {
          tree.mutate(node.path, {
            values: _.without([tag], node.values),
          })
        }}
        tagStyle={bgJoin(tagToGroupJoin(node.join))}
        submit={tree.triggerUpdate}
        placeholder={placeholder}
      />
      <Popover open={open}>
        <TagsJoinPicker tag={selectedTag} node={node} tree={tree} />
      </Popover>
    </div>
  )
}

export default contexturify(Text)
