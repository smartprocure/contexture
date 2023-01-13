import F from 'futil'
import _ from 'lodash/fp.js'
import React from 'react'
import { observer } from 'mobx-react'

import { withTheme } from '../utils/theme.js'

let ModalPicker = ({
  options = [],
  className = '',
  modalClassName = '',
  onChange,
  label,
  theme: { Button, NestedPicker, Modal },
  ...props
}) => {
  let open = React.useState(false)
  return (
    !!options.length && (
      <>
        <Modal open={open} className={modalClassName}>
          <NestedPicker
            options={options}
            onChange={x => {
              onChange(x)
              F.off(open)()
            }}
            {...props}
          />
        </Modal>
        <Button
          className={`modal-picker-button ${className}`}
          onClick={F.on(open)}
        >
          {label}
        </Button>
      </>
    )
  )
}

export default _.flow(observer, withTheme)(ModalPicker)
