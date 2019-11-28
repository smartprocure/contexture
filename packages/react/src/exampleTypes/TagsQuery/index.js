import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { Grid, GridItem } from '../../greyVest'
import { contexturifyWithoutLoader } from '../../utils/hoc'
import { useLensObject } from '../../utils/react'
import { getTagStyle, tagValueField } from './utils'
import TagActionsMenu from './TagActionsMenu'
import ActionsMenu from './ActionsMenu'

export let innerHeight = 40

let TagsQuery = ({
  tree,
  node,
  style,
  popoverState,
  actionWrapper,
  onAddTag = _.noop,
  theme: { Icon, TagsInput, Tag, Popover },
  ...props
}) => {
  let newPopoverState = useLensObject({ open: false, tagOpen: '' })
  popoverState = popoverState || newPopoverState

  let TagWithPopover = props => (
    <>
      <Popover
        isOpen={F.view(popoverState.tagOpen) === props.value}
        onClose={F.sets('', popoverState.tagOpen)}
        style={{ left: 0, top: 20 }}
      >
        <TagActionsMenu tag={props.value} {...{ node, tree }} />
      </Popover>
      <Tag {...props} />
    </>
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
          onTagClick={tag => F.set(tag, popoverState.tagOpen)}
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
        <div onClick={F.on(popoverState.open)}>
          <Icon icon="TableColumnMenu" />
        </div>
        <Popover open={popoverState.open} style={{ right: 0 }}>
          <ActionsMenu
            {...{
              node,
              tree,
              actionWrapper,
              open: popoverState.open,
            }}
          />
        </Popover>
      </GridItem>
    </Grid>
  )
}

export default contexturifyWithoutLoader(TagsQuery)
