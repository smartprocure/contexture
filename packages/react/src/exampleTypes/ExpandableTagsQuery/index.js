import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { withContentRect } from 'react-measure'
import { toJS } from 'mobx'
import { contexturifyWithoutLoader } from '../../utils/hoc.js'
import ExpandArrow from './ExpandArrow.js'
import { observer } from 'mobx-react'
import { toNumber } from '../../utils/format.js'
import TagActionsMenu from '../TagsQuery/TagActionsMenu.js'
import { Grid, GridItem, TextButton } from '../../greyVest/index.js'
import {
  getTagStyle,
  tagValueField,
  convertWordToTag,
} from '../TagsQuery/utils.js'
import ActionsMenu from '../TagsQuery/ActionsMenu.js'
import { useOutsideClick } from '@chakra-ui/react-use-outside-click'
import { sanitizeTagInputs } from 'contexture-util/keywordGenerations.js'
import KeywordGenerations from './KeywordGenerations.js'
import { sanitizeQueryStringTag } from '../../greyVest/utils.js'

let innerHeightLimit = 40

let isKeywordLightBulbOn = (tags) => sanitizeTagInputs(tags)?.length > 2

let triggerKeywordGeneration = async (node, tree) => {
  await tree.mutate(node.path, { generateKeywords: true })
  tree.mutate(node.path, { generateKeywords: false })
}

let KeywordGenerationIcon = ({ strokeColor = 'currentColor' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke={strokeColor}
    strokeWidth="2"
  >
    <title>Enter 3 keywords to generate keyword suggestions.</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
)

let ExpandableTagsQuery = ({
  measureRef,
  contentRect,
  collapse,
  hasPopover,
  theme,
  tree,
  node,
  innerEdgeMargins = {},
  ...props
}) => {
  let generationsCollapsed = React.useState(true)
  let { marginRight, marginLeft } = innerEdgeMargins
  let ref = React.useRef()
  useOutsideClick({
    ref,
    handler: () => !hasPopover?.current && F.on(generationsCollapsed)(),
  })

  let showMoreKeywordsButton =
    F.view(collapse) &&
    contentRect.entry.height > innerHeightLimit &&
    !!node.tags.length

  return (
    <div ref={ref} onMouseUp={(e) => e.stopPropagation()}>
      <div>
        <div
          style={{
            overflow: 'hidden',
            maxHeight: F.view(collapse) ? innerHeightLimit : '',
          }}
        >
          <div ref={measureRef}>
            <TagsWrapper
              {..._.omit('measure', props)}
              tree={tree}
              node={node}
              theme={theme}
              hasPopover={hasPopover}
              generationsCollapsed={generationsCollapsed}
            />
          </div>
        </div>
        {showMoreKeywordsButton && (
          <div style={{ minHeight: 10 }}>
            <ExpandArrow collapse={collapse} tagsLength={node.tags.length} />
          </div>
        )}
      </div>
      {/*Margin is to ensure that view more(ExpandArrow) is presented nicely*/}
      {!F.view(generationsCollapsed) && (
        <hr
          style={{
            border: '1px solid #EBEBEB',
            ...(!_.isEmpty(innerEdgeMargins) && { marginLeft, marginRight }),
            ...(!F.view(collapse) && { marginBottom: '10px' }),
            ...(showMoreKeywordsButton && { marginBottom: 20 }),
          }}
        />
      )}
      <KeywordGenerations
        node={node}
        tree={tree}
        Tag={theme.Tag}
        generationsCollapsed={generationsCollapsed}
        innerEdgeMargins={innerEdgeMargins}
        {...props}
      />
    </div>
  )
}

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
    splitCommas = true,
    maxTags = 1000,
    hasPopover,
    enableKeywordGenerations,
    generationsCollapsed,
    ...props
  }) => {
    let TagWithPopover = React.memo(
      observer((props) => {
        let count =
          _.get(['context', 'tags', props.value], node) ??
          _.get(['context', 'keywordGenerations', props.value], node) ??
          (node.forceFilterOnly || node.updating
            ? undefined
            : F.when(
                _.isNaN(),
                undefined,
                _.get(`context.tags.${props.value}`, node)
              ))
        let tagProps = {
          ...props,
          ...(!_.isNil(count) && {
            label: `${props.value} (${toNumber(count)})`,
          }),
        }
        return (
          <Popover
            position="right top"
            closeOnPopoverClick={false}
            trigger={<Tag {...tagProps} />}
            onOpen={() => (hasPopover.current = true)}
            onClose={() => (hasPopover.current = false)}
          >
            <TagActionsMenu
              tag={props.value}
              {...{ node, tree }}
              onChange={() => (hasPopover.current = false)}
            />
          </Popover>
        )
      })
    )

    return (
      <>
        <Grid
          data-path={node.path}
          rows={`${innerHeightLimit}px minmax(0, auto)`}
          columns="1fr auto auto"
          style={{ ...style, marginBottom: 10 }}
        >
          <GridItem height={2} place="center stretch">
            <TagsInput
              splitCommas={splitCommas}
              sanitizeTagFn={sanitizeQueryStringTag}
              maxTags={maxTags}
              tags={
                node.tags?.length > 0
                  ? _.map(tagValueField, node.tags)
                  : F.on(generationsCollapsed)()
              }
              onTagsDropped={onTagsDropped}
              addTags={(addedTags) => {
                let addedTagObjects = _.map(convertWordToTag, addedTags)
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
                node.tags?.length <= 2 && F.on(generationsCollapsed)()
              }}
              tagStyle={getTagStyle(node, tagValueField)}
              submit={tree.triggerUpdate}
              Tag={TagWithPopover}
              style={{ flex: 1, border: 0 }}
              {...props}
            />
          </GridItem>
          <GridItem place="center">
            <TextButton
              style={
                // Show suggestion lightbulb if min of 3 non numeric tags exist,
                // including numbers ups the chance of producing bad suggestions
                {
                  display: 'flex',
                  width: 32,
                  strokeOpacity: 0.5,
                  ...(!enableKeywordGenerations && { display: 'none' }),
                  ...(isKeywordLightBulbOn(node.tags) && {
                    strokeOpacity: 1.0,
                  }),
                }
              }
              onClick={async () => {
                // Generate keywords or show existing keywords
                if (!node.generateKeywords && isKeywordLightBulbOn(node.tags)) {
                  // Store to operate on this after showing keyword section,
                  // so that the loading indicator is shown while generating keywords
                  let collapsedState = F.view(generationsCollapsed)
                  let context = toJS(node.context)
                  F.off(generationsCollapsed)()
                  if (
                    !collapsedState ||
                    _.isEmpty(context.keywordGenerations) ||
                    _.isEmpty(
                      _.difference(
                        _.keys(context.keywordGenerations),
                        _.keys(context.tags)
                      )
                    )
                  ) {
                    await triggerKeywordGeneration(node, tree)
                  }
                }
              }}
            >
              <KeywordGenerationIcon
                strokeColor={
                  isKeywordLightBulbOn(node.tags) ? '#0076de' : 'currentColor'
                }
              />
            </TextButton>
          </GridItem>
          <GridItem place="center">
            <Popover
              style={{ width: 'auto' }}
              position={popoverPosition}
              arrow={popoverArrow}
              offsetY={popoverOffsetY}
              closeOnPopoverClick={false}
              trigger={
                <div style={{ display: 'flex', justifyContent: 'center' }}>
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
      </>
    )
  }
)

export default _.flow(
  contexturifyWithoutLoader,
  withContentRect()
)(ExpandableTagsQuery)
