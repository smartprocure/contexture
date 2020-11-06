import F from 'futil'
import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'

import { withTheme } from '../utils/theme'

let ModalPicker = ({
  options = [],
  onChange,
  label,
  blockButton = false,
  theme: { Button, NestedPicker, Modal },
}) => {
  let open = React.useState(false)
  return (
    <>
      <Modal open={open}>
        <NestedPicker
          options={options}
          onChange={x => {
            onChange(x)
            F.off(open)()
          }}
        />
      </Modal>
      {!!options.length && (
        <Button
          onClick={F.on(open)}
          style={
            blockButton
              ? {
                  display: 'block',
                  width: '100%',
                  marginTop: 6,
                }
              : null
          }
        >
          {label}
        </Button>
      )}
    </>
  )
}

export default _.flow(observer, withTheme)(ModalPicker)
