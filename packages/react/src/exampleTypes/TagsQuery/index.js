import React from 'react'
import F from 'futil'
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
  onTagsDropped = _.noop,
  popoverPosition = 'bottom right',
  popoverArrow,
  popoverOffsetY,
  theme: { Icon, TagsInput, Tag, Popover },
  joinOptions,
  wordsMatchPattern,
  sanitizeTags = true,
  splitCommas = true,
  maxTags = 1000,
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
          splitCommas={splitCommas}
          sanitizeTags={sanitizeTags}
          maxTags={maxTags}
          wordsMatchPattern={wordsMatchPattern}
          tags={_.map(tagValueField, node.tags)}
          onTagsDropped={onTagsDropped}
          addTags={tags => {
            let tagObjects = _.map(
              tag => ({ [tagValueField]: tag, distance: 3 }),
              tags
            )
            let allTags = [...node.tags, ...tagObjects]
            // Limit the number of tags to maxTags
            if (_.size(allTags) > maxTags) {
              allTags = _.take(maxTags, allTags)
              onTagsDropped(maxTags, tags)
            }
            tree.mutate(node.path, { tags:  allTags })
            onAddTag(tags)
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
