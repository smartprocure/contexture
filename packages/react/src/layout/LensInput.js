import React from 'react'
import { observer } from 'mobx-react'
import { value } from '../utils/actout'

export default observer(({ lens, Input, placeholder, ...x }) => (
  <Input {...value(lens)} placeholder={placeholder} {...x} />
))
