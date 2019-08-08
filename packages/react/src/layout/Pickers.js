import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { useLens } from '../utils/react'

export let ModalPicker = observer(
  ({ options, Button = 'button', onChange, label, Picker, Modal }) => {
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
)
ModalPicker.displayName = 'ModalPicker'
