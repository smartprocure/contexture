import React from 'react'
import { observer } from 'mobx-react'
import { value } from '../utils/actout'

export default observer(({ lens, Input, ...x }) => (
  <Input {...value(lens)} {...x} />
))
