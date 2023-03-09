import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { withContentRect } from 'react-measure'
import { contexturifyWithoutLoader } from '../../utils/hoc.js'
import ExpandArrow from './ExpandArrow.js'
import { observer } from 'mobx-react'
import { toNumber } from '../../utils/format.js'
import TagActionsMenu from '../TagsQuery/TagActionsMenu.js'
import { Grid, GridItem } from '../../greyVest/index.js'
import { getTagStyle, tagValueField } from '../TagsQuery/utils.js'
import ActionsMenu from '../TagsQuery/ActionsMenu.js'

let innerHeightLimit = 40

let ExpandableTagsQuery = ({ measureRef, contentRect, collapse, ...props }) => (
  <>
    <div
      style={{
        overflow: 'hidden',
        maxHeight: F.view(collapse) ? innerHeightLimit : '',
      }}
    >
      <div ref={measureRef}>
        <TagsWrapper {..._.omit('measure', props)} />
      </div>
    </div>
    {F.view(collapse) &&
      contentRect.entry.height > innerHeightLimit &&
      !!props.node.tags.length && (
        <div style={{ minHeight: 10 }}>
          <ExpandArrow
            collapse={collapse}
            tagsLength={props.node.tags.length}
          />
        </div>
      )}
  </>
)

let TagsWrapper = observer(
  ({
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
    showLabelCounts = true,
    ...props
  }) => {
    let TagWithPopover = React.memo(
      observer((props) => {
        let result = _.get(['context', 'results', props.value], node)
        let label = props.value
        if (showLabelCounts) {
          label = `${label} (${toNumber(result)})`
        }
        let tagProps = {
          ...props,
          ...(!_.isNil(result) ? { label } : {}),
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
    )

    return (
      <Grid
        data-path={node.path}
        rows={`${innerHeightLimit}px minmax(0, auto)`}
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
            addTags={(addedTags) => {
              let addedTagObjects = _.map(
                (tag) => ({ [tagValueField]: tag, distance: 3 }),
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
            removeTag={(tag) => {
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
            {(close) => (
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
)

export default _.flow(
  contexturifyWithoutLoader,
  withContentRect()
)(ExpandableTagsQuery)
