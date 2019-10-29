import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { Grid, GridItem } from '../../greyVest'
import { contexturify } from '../../utils/hoc'
import { useLensObject } from '../../utils/react'
import { getTagStyle } from './utils'
import TagActionsMenu from './TagActionsMenu'
import ActionsMenu from './ActionsMenu'

const field = 'word'

let TagsQuery = ({
  tree,
  node,
  theme: { Icon, TagsInput, Tag, Popover },
  style,
  popoverState,
  ...props
}) => {
  let newPopoverState = useLensObject({ open: false, tagOpen: '' })
  popoverState = popoverState || newPopoverState

  let TagWithPopover = props => (
    <>
      <Popover
        isOpen={F.view(popoverState.tagOpen) === props.value}
        onClose={F.sets('', popoverState)}
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
      rows="40px minmax(0, auto)"
      columns="1fr auto"
      style={style}
    >
      <GridItem height={2} place="center stretch">
        <TagsInput
          splitCommas
          tags={_.map(field, node.tags)}
          addTag={tag => {
            tree.mutate(node.path, {
              tags: [...node.tags, { [field]: tag, distance: 3 }],
            })
          }}
          onTagClick={tag => F.set(tag, popoverState.tagOpen)}
          removeTag={tag => {
            tree.mutate(node.path, {
              tags: _.reject({ [field]: tag }, node.tags),
            })
          }}
          tagStyle={getTagStyle(node, field)}
          submit={tree.triggerUpdate}
          Tag={TagWithPopover}
          style={{ flex: 1, border: 0 }}
          {...props}
        />
      </GridItem>
      <GridItem place="center">
        <div onClick={F.on(popoverState.open)}>
          <Icon icon="TableColumnMenu" />
          <Popover open={popoverState.open} style={{ right: 0 }}>
            <ActionsMenu {...{ node, tree, open: popoverState.open }} />
          </Popover>
        </div>
      </GridItem>
    </Grid>
  )
}

export default contexturify(TagsQuery)
