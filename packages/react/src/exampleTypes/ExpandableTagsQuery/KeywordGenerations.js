import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { observer } from 'mobx-react'
import { toNumber } from '../../utils/format.js'
import { convertWordToTag } from '../TagsQuery/utils.js'

let keysToLower = _.flow(_.keys, _.map(_.toLower))
let addIcon = <i style={{ paddingLeft: '8px' }} className="fa fa-plus fa-sm" />
let BlankRemoveIcon = () => <div style={{ padding: 3 }} />

let KeywordGenerations = ({
  node,
  tree,
  Tag,
  generationsCollapsed,
  Loader,
  style
}) => (
  <div style={!F.view(generationsCollapsed) ? style : { display: 'none' }}>
    {node.isStale && node.generateKeywords && (
      <Loader style={{ textAlign: 'center' }} loading={true}>
        Loading...
      </Loader>
    )}
    {!node.generateKeywords &&
      _.map((word) => (
        <Tag
          tree={tree}
          node={node}
          onClick={({ value, label }) =>
            tree.mutate(node.path, {
              tags: [...node.tags, convertWordToTag(value, label)],
            })
          }
          AddIcon={addIcon}
          key={`tag-${word}`}
          RemoveIcon={BlankRemoveIcon}
          tagStyle={{
            borderRadius: '3px',
            padding: '2px 0px',
            backgroundColor: '#E2E2E2',
          }}
          value={`${word}`}
          label={`${word} (${toNumber(
            _.get(`context.keywordGenerations.${word}`)(node)
          )})`}
        />
      ))(
        _.reject(
          _.includes(_, _.map('word', node.tags)),
          keysToLower(node.context?.keywordGenerations)
        )
      )}
  </div>
)

export default observer(KeywordGenerations)
