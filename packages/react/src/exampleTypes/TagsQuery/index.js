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
      <div onClick={F.off(collapse)} style={{
        padding: 5,
        marginBottom: 20,
      }}>
        <ExpandableTagsQuery
          {...{ tree, node, collapse, actionWrapper, ...props }}
          onAddTag={F.off(collapse)}
          Loader={({ children }) => <div>{children}</div>}
          theme={{
            TagsInput:
              F.view(collapse) && !_.isEmpty(node.tags)
                ? Tags
                : ExpandableTagsInput,
          }}
          autoFocus
        />
      </div>
    </OutsideClickHandler>
  )
}

export default contexturifyWithoutLoader(TagsQuery)
