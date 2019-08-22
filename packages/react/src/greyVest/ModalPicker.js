import React from 'react'
import Flex from '../layout/Flex'
import BaseModalPicker from '../layout/ModalPicker'

let Label = (
  <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
    Add Custom Filter
    <i className="material-icons" style={{ opacity: 0.4 }}>
      filter_list
    </i>
  </Flex>
)

let ModalPicker = props => <BaseModalPicker {...props} label={Label} />

export default ModalPicker
