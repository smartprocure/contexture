import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import TagsJoinPicker from '../TagsJoinPicker'
import { withTheme } from '../../utils/theme'
import { Flex } from '../../greyVest'
import { copyTags, tagTerm, onClickWrapper } from './utils'

let ActionsMenu = ({
  node,
  tree,
  open,
  theme: { Button, Checkbox },
  onClick = _.noop,
}) => {
  let wrapper = onClickWrapper(node, onClick, open)
  return (
    <Flex
      style={{ minWidth: 240, padding: 10 }}
      className="tags-query-actions-menu"
      column
      justifyContent="stretch"
      alignItems="stretch"
    >
      {!!_.get('tags.length', node) && (
        <>
          <Button onClick={() => wrapper('copy', () => copyTags(node))}>
            Copy {_.startCase(tagTerm)}s
          </Button>
          <Button
            style={{ margin: '10px 0' }}
            onClick={() =>
              wrapper('clear', () => tree.mutate(node.path, { tags: [] }))
            }
          >
            Clear {_.startCase(tagTerm)}s
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
}

export default _.flow(
  observer,
  withTheme
)(ActionsMenu)
