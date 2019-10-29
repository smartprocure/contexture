import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { Grid, GridItem } from '../../greyVest'
import { contexturify } from '../../utils/hoc'
import { useLens } from '../../utils/react'
import { getTagStyle } from './utils'
import TagActionsMenu from './TagActionsMenu'
import ActionsMenu from './ActionsMenu'

const field = 'word'

let TagsQuery = ({
  tree,
  node,
  theme: { Icon, TagsInput, Tag, Popover },
  style,
  ...props
}) => {
  let open = useLens(false)
  let tagOpen = useLens('')

  let TagWithPopover = props => (
    <>
      <Popover
        isOpen={F.view(tagOpen) === props.value}
        onClose={F.sets('', tagOpen)}
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
          onTagClick={tag => F.set(tag, tagOpen)}
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
        <div onClick={F.on(open)}>
          <Icon icon="TableColumnMenu" />
          <Popover open={open} style={{ right: 0 }}>
            <ActionsMenu {...{ node, tree, open }} />
          </Popover>
        </div>
      </GridItem>
    </Grid>
  )
}

export default contexturify(TagsQuery)
