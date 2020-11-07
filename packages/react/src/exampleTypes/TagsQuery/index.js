import React from 'react'
import _ from 'lodash/fp'
import { Grid, GridItem } from '../../greyVest'
import { contexturifyWithoutLoader } from '../../utils/hoc'
import { getTagStyle, tagValueField } from './utils'
import TagActionsMenu from './TagActionsMenu'
import ActionsMenu from './ActionsMenu'

export let innerHeight = 40

let TagsQuery = ({
  tree,
  node,
  style,
  actionWrapper,
  onAddTag = _.noop,
  popoverPosition = 'bottom right',
  popoverArrow,
  popoverOffsetY,
  theme: { Icon, TagsInput, Tag, Popover },
  ...props
}) => {
  let TagWithPopover = props => (
    <Popover
      position="right top"
      closeOnPopoverClick={false}
      trigger={<Tag {...props} />}
    >
      <TagActionsMenu tag={props.value} {...{ node, tree }} />
    </Popover>
  )

  return (
    <Grid
      className="tags-query"
      rows={`${innerHeight}px minmax(0, auto)`}
      columns="1fr auto"
      style={style}
    >
      <GridItem height={2} place="center stretch">
        <TagsInput
          splitCommas
          tags={_.map(tagValueField, node.tags)}
          addTag={tag => {
            tree.mutate(node.path, {
              tags: [...node.tags, { [tagValueField]: tag, distance: 3 }],
            })
            onAddTag(tag)
          }}
          removeTag={tag => {
            tree.mutate(node.path, {
              tags: _.reject({ [tagValueField]: tag }, node.tags),
            })
          }}
          tagStyle={getTagStyle(node, tagValueField)}
          submit={tree.triggerUpdate}
          Tag={TagWithPopover}
          style={{ flex: 1, border: 0 }}
          {...props}
        />
      </GridItem>
      <GridItem place="center">
        <Popover
          style={{ width: 'auto' }}
          position={popoverPosition}
          arrow={popoverArrow}
          offsetY={popoverOffsetY}
          closeOnPopoverClick={false}
          trigger={
            <div>
              <Icon icon="TableColumnMenu" />
            </div>
          }
        >
          {close => (
            <ActionsMenu
              {...{
                node,
                tree,
                close,
                actionWrapper,
              }}
            />
          )}
        </Popover>
      </GridItem>
    </Grid>
  )
}

export default contexturifyWithoutLoader(TagsQuery)
