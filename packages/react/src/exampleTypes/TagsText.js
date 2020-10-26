import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { contexturify } from '../utils/hoc'
import { bgJoin } from '../styles/generic'

import TagsJoinPicker, { tagToGroupJoin } from './TagsJoinPicker'
import Flex from '../greyVest/Flex'
import { Grid } from '../greyVest'

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
              theme: { Select, Tag, TagsInput, Popover, Icon },
            }) => (
  <div className="contexture-text">
    <Select
      value={node.operator}
      onChange={e => tree.mutate(node.path, { operator: e.target.value })}
      options={operatorOptions}
    />

    <Flex className="tags-query">
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
        tagStyle={bgJoin(tagToGroupJoin(node.join))}
        submit={tree.triggerUpdate}
        placeholder={placeholder}
        style={{ flex: 1, border: 0 }}
      />

      <div>
        <Popover
          trigger={
            <Icon icon="TableColumnMenu" />
          }
          position="bottom right"
          closeOnPopoverClick={false}
          style={{ width: 'auto' }}
        >
          <TagsJoinPicker node={node} tree={tree} />
        </Popover>
      </div>
    </Flex>

  </div>
)

export default contexturify(Text)
