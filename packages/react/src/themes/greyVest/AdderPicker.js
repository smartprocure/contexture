import React from 'react'
import Flex from '../../layout/Flex'
import { withTheme } from '../../utils/theme'

let AddLabel = (
  <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
    Add Custom Filter
    <i className="material-icons" style={{ opacity: 0.4 }}>
      filter_list
    </i>
  </Flex>
)

let GVAdderPicker = ({ theme: { AdderPicker }, ...props }) => (
  <AdderPicker {...props} label={AddLabel} />
)

export default withTheme(GVAdderPicker)
