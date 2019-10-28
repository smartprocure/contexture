import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import TagsJoinPicker from './TagsJoinPicker'
import { withTheme } from '../utils/theme'
import { getTag } from '../utils/tagsQuery'

let TagQueryPopover = ({
  tag,
  node,
  tree,
  theme: { Button, Checkbox, RadioList, Select },
}) => {
  let tagInstance = getTag(tag, node)
  return (
    <div className="tags-input-popover">
      <div>
        <div className="popover-item">
          Keyword: <span className="filter-field-label">{tag}</span>
        </div>
        {_.includes(' ', tag) && (
          <React.Fragment>
            <div className="popover-item">
              <RadioList
                options={F.autoLabelOptions(['fuzzy', 'exact'])}
                value={tagInstance.distance ? 'fuzzy' : 'exact'}
                onChange={value => {
                  tagInstance.distance = value === 'fuzzy' ? 3 : 0
                  tree.mutate(node.path, { tags: [...node.tags] })
                }}
              />
            </div>
            <div className="popover-item">
              <Button
                onClick={() => {
                  tree.mutate(node.path, {
                    tags: _.map(tag => {
                      if (_.includes(' ', tag['word']))
                        tag.distance = tagInstance.distance
                      return tag
                    }, node.tags),
                  })
                }}
              >
                Apply to all keywords
              </Button>
            </div>
          </React.Fragment>
        )}
        <label className="popover-item labeled-checkbox">
          <Checkbox
            checked={tagInstance.onlyShowTheseResults}
            onChange={e => {
              tagInstance.onlyShowTheseResults = e.target.checked
              tree.mutate(node.path, { tags: [...node.tags] })
            }}
          />
          <span>Only view this keyword</span>
        </label>
      </div>
      <div>
        <div style={{ paddingBottom: '15px' }}>
          <small>
            <b>Applies to all keywords:</b>
          </small>
        </div>
        <label className="popover-item labeled-checkbox">
          <Checkbox
            checked={!node.exact}
            onChange={e => tree.mutate(node.path, { exact: !e.target.checked })}
          />
          <span>Enable stemming</span>
        </label>
        <div className="popover-item">
          <TagsJoinPicker node={node} tree={tree} Select={Select} />
        </div>
      </div>
    </div>
  )
}

export default _.flow(
  observer,
  withTheme
)(TagQueryPopover)
