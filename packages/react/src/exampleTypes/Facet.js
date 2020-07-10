import React from 'react'
import F from 'futil'
import { contexturify } from '../utils/hoc'
import { toNumber } from '../utils/format'
import {
  displayFn,
  displayBlankFn,
  SelectAll,
  Cardinality,
  FacetCheckboxList,
  FacetOptionsFilter,
} from '../utils/facet'

let Facet = ({
  tree,
  node,
  hide = {
    selectAll: false, // Hide the initial "Select All" checkbox
    radioList: false, // Hide the Include/Exclude radio list
    facetFilter: false, // Hide the search box above the facet checkboxes
    counts: false, // Hide the facet counts so only the labels are displayed
  },
  display = displayFn,
  displayBlank = displayBlankFn,
  formatCount = toNumber,
  theme: { RadioList },
}) => (
  <div className="contexture-facet">
    {!hide.radioList &&
      <RadioList
        value={node.mode || 'include'} // Fix by changing defaults in client example type
        onChange={mode => tree.mutate(node.path, { mode })}
        options={F.autoLabelOptions(['include', 'exclude'])}
      />
    }
    {!hide.facetFilter && <FacetOptionsFilter tree={tree} node={node} />}
    {!hide.selectAll && <SelectAll node={node} tree={tree} />}
    <FacetCheckboxList
      tree={tree}
      node={node}
      hide={hide}
      display={display}
      displayBlank={displayBlank}
      formatCount={formatCount}
    />
    <Cardinality {...{ node, tree }} />
  </div>
)

export default contexturify(Facet)
