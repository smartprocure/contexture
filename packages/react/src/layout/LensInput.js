import React from 'react'
import { observer } from 'mobx-react'
import { value } from '../utils/actout'

let LensInput = observer(({ lens, Input, ...x }) => (
  <Input {...value(lens)} {...x} />
))
LensInput.displayName = 'LensInput'

export default LensInput
