import React from 'react'
import { contexturify } from '../utils/hoc.js'
import { toNumber } from '../utils/format.js'
import { FacetCheckboxList, displayFn, displayBlankFn } from '../utils/facet.js'

let DateRangeFacet = ({
  tree,
  node,
  hide = {
    counts: false, // Hide the facet counts so only the labels are displayed
  },
  display = displayFn,
  displayBlank = displayBlankFn,
  formatCount = toNumber,
}) => (
  <div className="contexture-daterangefacet" data-path={node.path}>
    <FacetCheckboxList
      tree={tree}
      node={node}
      hide={hide}
      display={display}
      displayBlank={displayBlank}
      formatCount={formatCount}
    />
  </div>
)

export default contexturify(DateRangeFacet)
