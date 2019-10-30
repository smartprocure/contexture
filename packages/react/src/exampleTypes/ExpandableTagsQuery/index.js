import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { withContentRect } from 'react-measure'
import { contexturify } from '../../utils/hoc'
import TagsQuery from '../TagsQuery'
import ExpandArrow from './ExpandArrow'

let collapsedStyle = {
  maxHeight: 40,
  overflowY: 'auto',
}

let ExpandableTagsQuery = ({ measureRef, contentRect, collapse, ...props }) => (
  <>
    <div style={F.view(collapse) ? collapsedStyle : {}}>
      <div ref={measureRef}>
        <TagsQuery {...props} />
      </div>
    </div>
    {F.view(collapse) && contentRect.entry.height > 41 && (
      <ExpandArrow collapse={collapse} tagsLength={props.node.tags.length} />
    )}
  </>
)

export default _.flow(
  contexturify,
  withContentRect()
)(ExpandableTagsQuery)
