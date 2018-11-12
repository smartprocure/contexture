import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { withStateLens } from '../utils/mobx-react-utils'

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
  )
)
ModalPicker.displayName = 'ModalPicker'
