import React from 'react'
import { contexturify } from '../../utils/hoc'
import ExpandArrow from './ExpandArrow'
import TagsQuery from '.'

let ExpandableTagsQuery = props => {
  let { node, collapse } = props
  return (
    <>
      <TagsQuery {...props} />
      {collapse && (
        <ExpandArrow collapse={collapse} tagsLength={node.tags.length} />
      )}
    </>
  )
}

export default contexturify(ExpandableTagsQuery)
