import React from 'react'
import { contexturifyWithoutLoader } from '../../utils/hoc'
import ExpandableTagsQuery from '../ExpandableTagsQuery'
import OutsideClickHandler from 'react-outside-click-handler'
import F from 'futil'
import _ from 'lodash/fp'
import ExpandableTagsInput, { Tags } from '../../greyVest/ExpandableTagsInput'

let TagsQuery = ({
  tree,
  node,
  actionWrapper,
  ...props
}) => {
  let collapse = React.useState(true)
  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        F.on(collapse)()
      }}
      useCapture={false}
    >
      <div
        className="tags-query"
        onClick={F.off(collapse)}
        style={{ marginBottom: 10 }}
      >
        <ExpandableTagsQuery
          {...{ tree, node, collapse, actionWrapper, ...props }}
          autoFocus
          onAddTag={F.off(collapse)}
          Loader={({ children }) => <div>{children}</div>}
          style={{ padding: '0 5px' }}
          theme={{
            TagsInput:
              F.view(collapse) && !_.isEmpty(node.tags)
                ? Tags
                : ExpandableTagsInput,
          }}
        />
      </div>
    </OutsideClickHandler>
  )
}

export default contexturifyWithoutLoader(TagsQuery)
