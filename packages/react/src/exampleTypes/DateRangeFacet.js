import React from 'react'
import { contexturify } from '../utils/hoc'
import { toNumber } from '../utils/format'
import { FacetCheckboxList, displayFn, displayBlankFn } from '../utils/facet'

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
  <div className="contexture-facet">
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
