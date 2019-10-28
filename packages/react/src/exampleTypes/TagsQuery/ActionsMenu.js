import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import TagsJoinPicker from '../TagsJoinPicker'
import { withTheme } from '../../utils/theme'
import { copyTags } from './utils'

let ActionsMenu = ({ node, tree, open, theme: { Button, Checkbox } }) => (
  <div className="tags-popover">
    {!!_.get('tags.length', node) && (
      <>
        <Button
          className="popover-item"
          onClick={() => {
            copyTags(node)
            F.off(open)()
          }}
        >
          Copy Keywords
        </Button>
        <Button
          className="popover-item"
          style={{ marginTop: 15 }}
          onClick={() => {
            tree.mutate(node.path, {
              tags: [],
            })
            F.off(open)()
          }}
        >
          Clear Keywords
        </Button>
        <div className="line-separator" />
      </>
    )}
    <label className="labeled-checkbox">
      <Checkbox
        checked={!node.exact}
        onChange={e => tree.mutate(node.path, { exact: !e.target.checked })}
      />
      <span>Enable stemming</span>
    </label>
    <div className="popover-item">
      <TagsJoinPicker node={node} tree={tree} />
    </div>
  </div>
)

export default _.flow(
  observer,
  withTheme
)(ActionsMenu)
