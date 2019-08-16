import React from 'react'
import Flex from '../../layout/Flex'
import ModalPicker from '../../layout/ModalPicker'

let AddLabel = (
  <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
    Add Custom Filter
    <i className="material-icons" style={{ opacity: 0.4 }}>
      filter_list
    </i>
  </Flex>
)

let AdderPicker = props => <ModalPicker {...props} label={AddLabel} />

export default AdderPicker
