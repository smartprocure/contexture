import FilterAdder from './FilterAdder'
import React from 'react'
import { withTheme } from './utils/theme'

// TODO: Rename the file to LabelledFilterAdder.
let LabelledFilterAdder = ({
  theme: { AdderPicker },
  label = 'Add Custom Filter',
  ...props
}) => {
  let LabelledAdderPicker = pickerProps => (
    <AdderPicker {...pickerProps} label={label} />
  )
  return (
    <FilterAdder
      {...props}
      theme={{ AdderPicker: LabelledAdderPicker }}
    />
  )
}

export default withTheme(LabelledFilterAdder)
