import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { withContentRect } from 'react-measure'
import { contexturify } from '../../utils/hoc'
import ExpandArrow from './ExpandArrow'
import { observer } from 'mobx-react'
import { toNumber } from '../../utils/format'
import TagActionsMenu from '../TagsQuery/TagActionsMenu'
import { Grid, GridItem } from '../../greyVest'
import { getTagStyle, tagValueField } from '../TagsQuery/utils'
import ActionsMenu from '../TagsQuery/ActionsMenu'

let collapsedStyle = {
  maxHeight: innerHeight,
  overflowY: 'auto',
}

export let innerHeight = 40

let ExpandableTagsQuery = ({ measureRef, contentRect, collapse, ...props }) => (
  <>
    <div style={F.view(collapse) ? collapsedStyle : {}}>
      <div ref={measureRef}>
        <Tags {..._.omit('measure', props)} />
      </div>
    </div>
    {F.view(collapse)
    && contentRect.entry.height > innerHeight
    && !!props.node.tags.length && (
      <div style={{ minHeight: 20 }}>
        <ExpandArrow collapse={collapse} tagsLength={props.node.tags.length} />
      </div>
    )}
  </>
)

let Tags = ({
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
          addTags={addedTags => {
            let addedTagObjects = _.map(
              tag => ({ [tagValueField]: tag, distance: 3 }),
              addedTags
            )
            let tags = [...node.tags, ...addedTagObjects]
            // Limit the number of tags to maxTags
            if (_.size(tags) > maxTags) {
              tags = _.take(maxTags, tags)
              onTagsDropped(maxTags, tags)
            }
            tree.mutate(node.path, { tags })
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

export default _.flow(contexturify, withContentRect())(ExpandableTagsQuery)
