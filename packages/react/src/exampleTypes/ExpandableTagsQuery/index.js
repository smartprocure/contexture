import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { withContentRect } from 'react-measure'
import { contexturifyWithoutLoader } from '../../utils/hoc.js'
import ExpandArrow from './ExpandArrow.js'
import { observer } from 'mobx-react'
import { toNumber } from '../../utils/format.js'
import TagActionsMenu from '../TagsQuery/TagActionsMenu.js'
import { Flex, Grid, GridItem, TextButton } from '../../greyVest/index.js'
import { getTagStyle, tagValueField } from '../TagsQuery/utils.js'
import ActionsMenu from '../TagsQuery/ActionsMenu.js'
import { useOutsideClick } from '@chakra-ui/react-use-outside-click'
import { sanitizeTagInputs } from 'contexture-elasticsearch/utils/keywordGenerations.js'

let innerHeightLimit = 40
let addIcon = <i style={{ paddingLeft: '8px' }} className="fa fa-plus fa-sm" />
let BlankRemoveIcon = () => <div style={{ padding: 3 }} />
let convertWordToTag = (word, label = '') => ({ [tagValueField]: word, label, distance: 3 })
let triggerKeywordGeneration =  async (node, tree) => {
  await tree.mutate(node.path, {generateKeywords: true})
  tree.mutate(node.path, { generateKeywords: false })
}

let KeywordGenerationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 28 28"
    stroke="currentColor"
    strokeWidth="2"
  >
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
  theme,
  tree,
  node,
  Loader,
  ...props
}) => {
  let generationsCollapsed = React.useState(true)

  let ref = React.useRef()
  useOutsideClick({ ref, handler: F.on(generationsCollapsed) })
  return (
    <div
      ref={ref}
      onMouseUp={(e) => {
        e.stopPropagation()
      }}
    >
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
              generationsCollapsed={generationsCollapsed}
            />
          </div>
        </div>
        {F.view(collapse) &&
          contentRect.entry.height > innerHeightLimit &&
          !!node.tags.length && (
            <div style={{ minHeight: 10 }}>
              <ExpandArrow collapse={collapse} tagsLength={node.tags.length} />
            </div>
          )}
      </div>
      <Flex>
        <div
          style={
            !F.view(generationsCollapsed)
              ? {
                  width: '100%',
                  marginTop: 20,
                  position: 'relative',
                  borderTop: '2px solid #EBEBEB',
                }
              : { display: 'none' }
          }
        >
          {node.isStale && (
            <Loader style={{ textAlign: 'center' }} loading={true}>
              Loading...
            </Loader>
          )}
          {!node.isStale &&
            _.map((word) => (
              <theme.Tag
                tree={tree}
                node={node}
                onClick={({ value, label }) => 
                  tree.mutate(
                    node.path, 
                    {
                      tags: [
                        ...node.tags,
                        convertWordToTag(value, label)
                      ],
                    }
                  )
                }
                AddIcon={addIcon}
                key={`tag-${word}`}
                RemoveIcon={BlankRemoveIcon}
                tagStyle={{
                  borderRadius: '3px',
                  padding: '3px 0px',
                  backgroundColor: '#E2E2E2',
                }}
                value={`${word}`}
                label={`${word} (${toNumber(
                  _.get(`context.keywordGenerations.${word}`)(node)
                )})`}
              />
            ))(
              _.reject(_.includes( _,  _.memoize(_.keys)(node.context.tags) ),
                _.keys(node.context.keywordGenerations)
              )
            )}
        </div>
      </Flex>
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
    wordsMatchPattern,
    sanitizeTags = true,
    splitCommas = true,
    maxTags = 1000,
    generationsCollapsed: generationsCollapse,
    enableKeywordGenerations,
    ...props
  }) => {
    let TagWithPopover = React.memo(
      observer((props) => {
        let count = F.cascade(
          [`context.tags.${props.value}`, `context.keywordGenerations.${props.value}`],
          node
        )
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
          >
            <TagActionsMenu tag={props.value} {...{ node, tree }} />
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
                  convertWordToTag,
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
            <TextButton
              style={
                // Show suggestion lightbulb if min of 3 non numeric tags exist,
                // including numbers ups the chance of producing bad suggestions
                sanitizeTagInputs(node.tags)?.length > 2 &&
                enableKeywordGenerations
                  ? { width: 35 }
                  : { display: 'none' }
              }
              onClick={async () => {
                // Generate keywords or show existing keywords
                if (!node.generateKeywords) {
                  // Store to operate on this after showing keyword section, 
                  // so that the loading indicator is shown while generating keywords
                  let collapsedState = F.view(generationsCollapse)
                  F.when(F.off(generationsCollapse)(), collapsedState)
                  (!collapsedState || _.isEmpty(node.context.keywordGenerations)) && await triggerKeywordGeneration(node, tree)
                }
              }}
            >
              <KeywordGenerationIcon />
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
      </>
    )
  }
)

export default _.flow(
  contexturifyWithoutLoader,
  withContentRect()
)(ExpandableTagsQuery)
