import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { useLens } from '../utils/react'

let ModalPicker = ({ options, Button = 'button', onChange, label, Picker, Modal }) => {
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

export default observer(ModalPicker)
