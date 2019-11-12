import F from 'futil'
import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'

import { withTheme } from '../utils/theme'

let ModalPicker = ({
  options,
  onChange,
  label,
  theme: { Button, NestedPicker, Modal },
}) => {
  let open = React.useState(false)
  return (
    <div>
      <Modal open={open}>
        <NestedPicker
          options={options}
          onChange={x => {
            onChange(x)
            F.off(open)()
          }}
        />
      </Modal>
      <Button onClick={F.on(open)}>{label}</Button>
    </div>
  )
}

export default _.flow(
  observer,
  withTheme
)(ModalPicker)
