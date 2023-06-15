import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { observer } from 'mobx-react'
import { toNumber } from '../../utils/format.js'
import { convertWordToTag } from '../TagsQuery/utils.js'

let keysToLower = _.flow(_.keys, _.map(_.toLower))

let addIcon = (
  <i
    className="material-icons"
    style={{ padding: '0px 2px', fontSize: 'small' }}
  >
    add
  </i>
)
let BlankRemoveIcon = () => <div style={{ padding: 3 }} />
let tipStrings = [
  'Click the keyword generator icon again to regenerate new suggestions based on the keywords selected for your search.',
  'Click on a keyword to add it to your search.',
]

let KeywordGenerations = ({
  node,
  tree,
  Tag,
  generationsCollapsed,
  innerEdgeMargins = {},
  Loader,
}) => {
  let [tips, setTips] = React.useState([...tipStrings])
  React.useEffect(() => {
    F.when(
      setTips((tips) => [_.last(tips), ..._.dropRight(1, tips)]),
      F.view(generationsCollapsed)
    )
  }, [generationsCollapsed])

  return (
    <div style={!F.view(generationsCollapsed) ? {} : { display: 'none' }}>
      <div>
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
              hoverColor={'#A9A9A9'}
              tagStyle={{
                borderRadius: '3px',
                padding: '0px 0px',
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
      <div
        style={{
          ...(!_.isEmpty(innerEdgeMargins) && {
            marginRight: innerEdgeMargins.marginRight,
            marginLeft: innerEdgeMargins.marginLeft,
            marginBottom: innerEdgeMargins.marginBottom,
          }),
          backgroundColor: '#f5f5f5',
          marginTop: '12px',
          padding: '4px 12px',
          borderBottomRightRadius: 3,
          borderBottomLeftRadius: 3,
          display: 'grid',
          gridTemplateColumns: '18px 1fr',
        }}
      >
        <i
          className="material-icons"
          style={{ margin: 'auto 0', padding: '0px 2px', fontSize: 'small' }}
        >
          info
        </i>
        <span
          style={{
            fontFamily: 'Lato',
            fontSize: '9px',
            fontWeight: 'normal',
            fontStretch: 'normal',
            fontStyle: 'italic',
            margin: 'auto 0',
          }}
        >
          Tip: {tips[0]}
        </span>
      </div>
    </div>
  )
}
export default observer(KeywordGenerations)
