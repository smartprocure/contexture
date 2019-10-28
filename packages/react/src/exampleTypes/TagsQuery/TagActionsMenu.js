import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { withTheme } from '../../utils/theme'
import { getTag } from './utils'

const tagValueField = 'word'

let TagActionsMenu = _.flow(
  observer,
  withTheme
)(({ tag, node, tree, theme: { Button, Checkbox, RadioList } }) => {
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
                      if (_.includes(' ', tag[tagValueField]))
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
    </div>
  )
})

export default _.flow(
  observer,
  withTheme
)(TagActionsMenu)
