import React from 'react'
import { contexturifyWithoutLoader } from '../../utils/hoc'
import ExpandableTagsQuery from '../ExpandableTagsQuery'

let TagsQuery = ({ tree, node, actionWrapper, ...props }) => (
  <div className="tags-query" style={{ marginBottom: 28 }}>
    <ExpandableTagsQuery
      {...{ tree, node, actionWrapper, ...props }}
      Loader={({ children }) => <div>{children}</div>}
      style={{ padding: '0 5px' }}
    />
  </div>
)

export default contexturifyWithoutLoader(TagsQuery)
