import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { contexturify, withTreeLens } from '../utils/hoc'
import { bgJoin } from '../styles/generic'

import { TagsInput as DefaultTagsInput } from '../layout/TagsInput'
import DefaultSelect from '../layout/Select'
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

let Text = _.flow(
  withTreeLens,
  contexturify
)(
  ({
    tree,
    node,
    TagsInput = DefaultTagsInput,
    Select = DefaultSelect,
    placeholder,
  }) => {
    let tagStyle = bgJoin(tagToGroupJoin(node.join))
    let TagPopover = () => (
      <div>
        <TagsJoinPicker node={node} tree={tree} Select={Select} />
      </div>
    )
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
          addTag={tag => {
            tree.mutate(node.path, { values: [...node.values, tag] })
          }}
          removeTag={tag => {
            tree.mutate(node.path, {
              values: _.without([tag], node.values),
            })
          }}
          tagStyle={tagStyle}
          submit={tree.triggerUpdate}
          placeholder={placeholder}
          PopoverContents={TagPopover}
        />
      </div>
    )
  }
)
export default Text
