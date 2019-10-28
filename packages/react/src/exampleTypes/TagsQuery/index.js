import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { setDisplayName } from 'recompose'
import { observer } from 'mobx-react'
import { Flex } from '../../greyVest'
import { contexturify } from '../../utils/hoc'
import { useLens } from '../../utils/react'
import { getTagStyle } from './utils'
import TagActionsMenu from './TagActionsMenu'
import ActionsMenu from './ActionsMenu'

const field = 'word'

let ExpandArrow = _.flow(
  setDisplayName('ExpandArrow'),
  observer
)(
  ({ collapse, tagsLength, style }) =>
    !!(F.view(collapse) && tagsLength) && (
      <div
        className="down-arrow-shape-container"
        onClick={F.off(collapse)}
        style={style}
      >
        <div
          style={{
            height: 0,
            cursor: 'pointer',
            textAlign: 'center',
            transform: 'translateY(-50%)',
          }}
          title="Expand to see all keywords"
        >
          <Flex
            style={{
              display: 'inline-flex',
              backgroundColor: 'white',
              borderRadius: 4,
              padding: '5px 12px',
              boxShadow: '0 1px 4px 0 rgba(39, 44, 65, 0.1)',
              color: '#9b9b9b',
              fontWeight: 400,
            }}
            alignItems="center"
            justifyContent="center"
          >
            View all {tagsLength} tags
          </Flex>
        </div>
      </div>
    )
)

let TagsQuery = ({
  tree,
  node,
  placeholder,
  collapse,
  theme: { Icon, Popover, TagsInput, Tag },
  style,
  ...props
}) => {
  let open = useLens(false)
  let TagWithPopover = ({ onClick, ...props }) => {
    let tagOpen = useLens(false)
    return (
      <>
        <Tag
          onClick={tag => {
            F.on(tagOpen)()
            onClick(tag)
          }}
          {...props}
        />
        <Popover open={tagOpen}>
          <TagActionsMenu {...{ tag: props.tag, node, tree }} />
        </Popover>
      </>
    )
  }
  return (
    <>
      <Flex className="tags-query" style={style}>
        <TagsInput
          splitCommas
          tags={_.map(field, node.tags)}
          addTag={tag => {
            tree.mutate(node.path, {
              tags: [...node.tags, { [field]: tag, distance: 3 }],
            })
          }}
          removeTag={tag => {
            tree.mutate(node.path, {
              tags: _.reject({ [field]: tag }, node.tags),
            })
          }}
          tagStyle={getTagStyle(node, field)}
          submit={tree.triggerUpdate}
          placeholder={placeholder}
          isOneLine={collapse && F.view(collapse)}
          Tag={TagWithPopover}
          style={{ flex: 1, border: 0 }}
          {...props}
        />
        <div onClick={F.on(open)}>
          <Icon icon="TableColumnMenu" />
          <Popover open={open}>
            <ActionsMenu {...{ node, tree, open }} />
          </Popover>
        </div>
      </Flex>
      {collapse && (
        <ExpandArrow collapse={collapse} tagsLength={node.tags.length} />
      )}
    </>
  )
}

export default contexturify(TagsQuery)
