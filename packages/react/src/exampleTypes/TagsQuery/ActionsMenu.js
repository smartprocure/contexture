import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import TagsJoinPicker from '../TagsJoinPicker'
import { withTheme } from '../../utils/theme'
import { Flex } from '../../greyVest'
import { copyTags, TAG_TERM } from './utils'

let ActionsMenu = ({ node, tree, open, theme: { Button, Checkbox } }) => (
  <Flex
    style={{ minWidth: 240, padding: 10 }}
    className="tags-query-actions-menu"
    column
    justifyContent="stretch"
    alignItems="stretch"
  >
    {!!_.get('tags.length', node) && (
      <>
        <Button
          onClick={() => {
            copyTags(node)
            F.off(open)()
          }}
        >
          Copy {_.startCase(TAG_TERM)}s
        </Button>
        <Button
          style={{ margin: '10px 0' }}
          onClick={() => {
            tree.mutate(node.path, {
              tags: [],
            })
            F.off(open)()
          }}
        >
          Clear {_.startCase(TAG_TERM)}s
        </Button>
        <div className="line-separator" />
      </>
    )}
    <label className="labeled-checkbox" style={{ margin: '10px 0' }}>
      <Checkbox
        htmlId="stemming"
        checked={!node.exact}
        onChange={e => tree.mutate(node.path, { exact: !e.target.checked })}
      />
      <span>Include word variations</span>
    </label>
    <div>
      <TagsJoinPicker node={node} tree={tree} />
    </div>
  </Flex>
)

export default _.flow(
  observer,
  withTheme
)(ActionsMenu)
