import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { withContentRect } from 'react-measure'
import { contexturify } from '../../utils/hoc'
import TagsQuery, { innerHeight } from '../TagsQuery'
import ExpandArrow from './ExpandArrow'

let collapsedStyle = {
  maxHeight: innerHeight,
  overflowY: 'auto',
}

let ExpandableTagsQuery = ({ measureRef, contentRect, collapse, ...props }) => (
  <>
    <div style={F.view(collapse) ? collapsedStyle : {}}>
      <div ref={measureRef}>
        <TagsQuery {...props} />
      </div>
    </div>
    {F.view(collapse) && contentRect.entry.height > innerHeight && (
      <ExpandArrow collapse={collapse} tagsLength={props.node.tags.length} />
    )}
  </>
)

export default _.flow(
  contexturify,
  withContentRect()
)(ExpandableTagsQuery)
