import React from 'react'
import _ from 'lodash/fp'
import { Grid, GridItem } from '../../greyVest'
import { contexturifyWithoutLoader } from '../../utils/hoc'
import { getTagStyle, tagValueField } from './utils'
import TagActionsMenu from './TagActionsMenu'
import ActionsMenu from './ActionsMenu'
import { observer } from 'mobx-react'
import { toNumber } from '../../utils/format'

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
  joinOptions,
  wordsMatchPattern,
  sanitizeTags = true,
  ...props
}) => {
  let TagWithPopover = observer(props => {
    let result = _.get(['context', 'results', props.value], node)
    let tagProps = {
      ...props,
      ...(!_.isNil(result)
        ? { label: `${props.value} (${toNumber(result)})` }
        : {}),
    }
    return (
      <Popover
        position="right top"
        closeOnPopoverClick={false}
        trigger={<Tag {...tagProps} />}
      >
        <TagActionsMenu tag={props.value} {...{ node, tree }} />
      </Popover>
    )
  })

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
          sanitizeTags={sanitizeTags}
          wordsMatchPattern={wordsMatchPattern}
          tags={_.map(tagValueField, node.tags)}
          // addTag: Called on every tag being added via the input. Use to decorate the tag into object form
          addTag={tag => {
            let tagObject = { [tagValueField]: tag, distance: 3 }
            onAddTag(tagObject)
            return tagObject
          }}
          // onTagsAdded: Called when all the tags are sanitized and converted to objects with their distance etc.
          onTagsAdded={tags => tree.mutate(node.path, { tags: [ ...node.tags,...tags ] })}
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
                joinOptions,
              }}
            />
          )}
        </Popover>
      </GridItem>
    </Grid>
  )
}

export default contexturifyWithoutLoader(TagsQuery)
