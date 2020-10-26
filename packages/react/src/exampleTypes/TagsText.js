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
  theme: { Select, Tag, TagsInput, Popover },
}) => (
  <div className="contexture-text">
    <Select
      value={node.operator}
      onChange={e => tree.mutate(node.path, { operator: e.target.value })}
      options={operatorOptions}
    />

    <TagsInput
      splitCommas
      tags={node.values}
      addTag={tag => {
        tree.mutate(node.path, { values: [...node.values, tag] })
      }}
      removeTag={tag => {
        tree.mutate(node.path, {
          values: _.without([tag], node.values),
        })
      }}
      Tag={props =>
        <Popover
          trigger={<Tag {..._.omit('onClick', props)} />}
          position="bottom left"
          closeOnPopoverClick={false}
          style={{ width: 284 }}
        >
          <TagsJoinPicker node={node} tree={tree} />
        </Popover>
      }
      tagStyle={bgJoin(tagToGroupJoin(node.join))}
      submit={tree.triggerUpdate}
      placeholder={placeholder}
    />
  </div>
)


export default contexturify(Text)
