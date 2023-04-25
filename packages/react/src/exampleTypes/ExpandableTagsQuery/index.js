import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { withContentRect } from 'react-measure'
import { contexturifyWithoutLoader } from '../../utils/hoc.js'
import ExpandArrow from './ExpandArrow.js'
import { observer } from 'mobx-react'
import { toNumber } from '../../utils/format.js'
import TagActionsMenu from '../TagsQuery/TagActionsMenu.js'
import { Flex, Grid, GridItem } from '../../greyVest/index.js'
import { getTagStyle, tagValueField } from '../TagsQuery/utils.js'
import ActionsMenu from '../TagsQuery/ActionsMenu.js'
import { TextButton, Button, Tag } from '../../greyVest/index.js'
import axios from 'axios'

const keywordOpts = {
  "prompt": "",
  "numResults": 2,
  "maxTokens": 50,
  "temperature": 0.4,
  "topKReturn": 0,
  "topP":1,
  "countPenalty": {
    "scale": 100,
    "applyToNumbers": true,
    "applyToPunctuations": false,
    "applyToStopwords": false,
    "applyToWhitespaces": false,
    "applyToEmojis": true
  },
  "frequencyPenalty": {
    "scale": 100,
    "applyToNumbers": true,
    "applyToPunctuations": false,
    "applyToStopwords": false,
    "applyToWhitespaces": false,
    "applyToEmojis": false
  },
  "presencePenalty": {
    "scale": 100,
    "applyToNumbers": true,
    "applyToPunctuations": false,
    "applyToStopwords": false,
    "applyToWhitespaces": false,
    "applyToEmojis": true
  },
  "stopSequences":['.']
}

const keywordConfig = {
  headers: { Authorization: `Bearer dxgDJjAF664Yv5oJGl2FfhuxF2rm46MI` }
};

const getKeywordGenerations = async (tags) => {
  keywordOpts.prompt = `Keyword list: ${_.map('word', tags).join(',')}, `
  let results = await axios.post('https://api.ai21.com/studio/v1/j1-jumbo/complete', keywordOpts, keywordConfig)

  console.log(results) 
  let completions = results.data.completions 
  //Choose the longest completion to avoid edge cases of one completion returning nothing
  let index = completions[0].data.text.length > completions[1].data.text.length ? 0 : 1
  let keywordGenerations = results.data.completions[index].data.text
  keywordGenerations = keywordGenerations.split(',')
  keywordGenerations = _.map((val)=> ({word: val, distance: 3}), keywordGenerations)
  return keywordGenerations
}


let innerHeightLimit = 40
let addIcon = <i style={{'padding-left': 3}} class="fa fa-plus"/>
let BlankRemoveIcon = () => <div style={{padding: 3}}/>

let ExpandableTagsQuery = ({ measureRef, contentRect, collapse, theme,  ...props }) => (
  <>
  <div>
    <div
      style={{
        overflow: 'hidden',
        maxHeight: F.view(collapse) ? innerHeightLimit : '',
      }}
    >
      <div ref={measureRef}>
        <TagsWrapper {..._.omit('measure', props)} theme={theme} />
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
      
  </div>
  <Flex >
    <div style={(props.node.keywordGenerations.length > 0 ? {
      width: '100%', 
      position: 'relative', 
      'border-top': '2px solid #EBEBEB',
      } : {display: 'none'})}>
          {!F.isBlank(_.get(`context.results`, props.node)) ?
            _.map(({word}) => (
            <theme.Tag 
              moveTag={(value) => (e)=> {
                console.log("Removing tag: ", value)
                props.tree.mutate(props.node.path, {  
                  tags: [...props.node.tags, {[tagValueField]: value, distance: 3 }],
                  keywordGenerations: _.reject({ [tagValueField]: value }, props.node.keywordGenerations),
                })
    
                e.preventDefault()
              }}
              AddIcon={addIcon}  
              RemoveIcon={BlankRemoveIcon} 
              tagStyle={{'border-radius': '3px', 'background-color': '#E2E2E2'}}
              value={`${word}`}
              label={`${word} (${toNumber(_.get(`context.results.${word}`)(props.node))})`}
            />))(props.node.keywordGenerations) 
            : null
          }
    </div>
  </Flex>
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
    ...props
  }) => {
    let TagWithPopover = React.memo(
      observer((props) => {
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
    )
    console.log("Node: ", node)

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
            <TextButton style={(node.tags.length > 2 ? {width: 35}: {display: 'none'})}
              onClick={async (e)=>{

                //Call API HERE
                let generations = await getKeywordGenerations(node.tags)
                console.log("Keyword Generations: ", generations)
                /* [
                  { word: 'soap', distance: '3'},
                  { word: 'shampoo', distance: '3'},
                  { word: 'conditioner', distance: '3'},
                ] */
                await tree.mutate(node.path, { keywordGenerations: generations })
                console.log("Keyword Generations: ", _.get(['context', 'results', 'soap'], node))
                e.preventDefault()
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 28 28" stroke="currentColor" stroke-width="2" >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
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
