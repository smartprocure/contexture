// import React from 'react'
import FilterAdder from '../../FilterAdder'
import { ModalPicker as DefaultModalPicker, NestedPicker } from '../../layout/'
import React from 'react'
import { withTheme } from '../../utils/theme'

let ModalFilterAdder = ({
  theme: { Picker = NestedPicker, ModalPicker = DefaultModalPicker },
  label = 'Add Custom Filter',
  ...props
}) => {
  let LabelledModalPicker = pickerProps => (
    <ModalPicker {...pickerProps} label={label} />
  )
  return (
    <FilterAdder
      {...props}
      theme={{ Picker: LabelledModalPicker, 'ModalPicker.Picker': Picker }}
    />
  )
}

export default withTheme(ModalFilterAdder)
