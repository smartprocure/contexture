import F from 'futil-js'
import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'
import { useLens } from '../utils/react'
import { withTheme } from '../utils/theme'

let ModalPicker = ({
  options,
  theme: { Button, Picker, Modal },
  onChange,
  label,
}) => {
  let isOpen = useLens(false)
  return (
    <div>
      <Modal isOpen={isOpen}>
        <Picker
          options={options}
          onChange={x => {
            onChange(x)
            F.off(isOpen)()
          }}
        />
      </Modal>
      <Button onClick={F.on(isOpen)}>{label}</Button>
    </div>
  )
}

export default _.flow(
  observer,
  withTheme
)(ModalPicker)
