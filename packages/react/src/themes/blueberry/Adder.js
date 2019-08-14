// import React from 'react'
import FilterAdder from '../../FilterAdder'
import React from 'react'
import { withTheme } from '../../utils/theme'

let ModalFilterAdder = ({
  theme: { Picker, ModalPicker },
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
