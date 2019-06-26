import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { withStateLens } from '../utils/mobx-react-utils'

export let ExternalModalPicker = ({Modal, Picker, options, onChange, isOpen}) =>  (
  <Modal isOpen={isOpen}>
    <Picker
      options={options}
      onChange={x => {
        onChange(x)
        F.off(isOpen)()
      }}
    />
    </Modal>
  )

export let ModalPicker = withStateLens({ isOpen: false })(
  observer(
    ({
      options,
      isOpen,
      Button = 'button',
      onChange,
      label,
      Picker,
      Modal,
    }) => (
      <div>
        <ExternalModalPicker 
          Modal={Modal}
          isOpen={isOpen}
          Picker={Picker}
          options={options}
          onChange={onChange}
        />
        <Button onClick={F.on(isOpen)}>{label}</Button>
      </div>
    )
  )
)
ModalPicker.displayName = 'ModalPicker'
