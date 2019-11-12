import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { observer } from 'mobx-react'
import { withTheme } from '../../utils/theme'
import { getTag, tagTerm, tagValueField } from './utils'

let TagActionsMenu = ({
  tag,
  node,
  tree,
  theme: { Button, Checkbox, RadioList },
}) => {
  let tagInstance = getTag(tag, node)
  return (
    <div
      className="tags-query-tag-actions-menu"
      style={{ minWidth: 200, padding: 10 }}
    >
      <div>
        {_.startCase(tagTerm)}:{' '}
        <span className="filter-field-label">{tag}</span>
      </div>
      {_.includes(' ', tag) && (
        <div style={{ margin: '10px 0' }}>
          <RadioList
            options={F.autoLabelOptions(['fuzzy', 'exact'])}
            value={tagInstance.distance ? 'fuzzy' : 'exact'}
            onChange={value => {
              tagInstance.distance = value === 'fuzzy' ? 3 : 0
              tree.mutate(node.path, { tags: [...node.tags] })
            }}
          />
          <Button
            onClick={() => {
              tree.mutate(node.path, {
                tags: _.map(tag => {
                  if (_.includes(' ', tag[tagValueField]))
                    tag.distance = tagInstance.distance
                  return tag
                }, node.tags),
              })
            }}
          >
            Apply to all {tagTerm}s
          </Button>
        </div>
      )}
      <label className="labeled-checkbox" style={{ marginTop: 15 }}>
        <Checkbox
          checked={tagInstance.onlyShowTheseResults}
          onChange={e => {
            tagInstance.onlyShowTheseResults = e.target.checked
            tree.mutate(node.path, { tags: [...node.tags] })
          }}
        />
        <span>Only view this {tagTerm}</span>
      </label>
    </div>
  )
}

export default _.flow(
  observer,
  withTheme
)(TagActionsMenu)
