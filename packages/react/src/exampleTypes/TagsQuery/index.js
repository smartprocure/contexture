import F from 'futil'
import _ from 'lodash/fp'
import React from 'react'
import { contexturifyWithoutLoader } from '../../utils/hoc'
import ExpandableTagsQuery from '../ExpandableTagsQuery'
import ExpandableTagsInput, { Tags } from '../../greyVest/ExpandableTagsInput'

let TagsQuery = ({ tree, node, actionWrapper, ...props }) => {
  let collapse = React.useState(true)
  let isCollapsed = F.view(collapse) && !_.isEmpty(node.tags)
  return (
    <div
      data-path={node.path}
      className="tags-query"
      onClick={F.off(collapse)}
      style={{ marginBottom: isCollapsed ? 28 : 10 }}
    >
      <ExpandableTagsQuery
        {...{ tree, node, collapse, actionWrapper, ...props }}
        onAddTag={F.off(collapse)}
        Loader={({ children }) => <div>{children}</div>}
        style={{ padding: '0 5px' }}
        theme={{
          TagsInput: isCollapsed ? Tags : ExpandableTagsInput,
        }}
      />
    </div>
  )
}

export default contexturifyWithoutLoader(TagsQuery)
