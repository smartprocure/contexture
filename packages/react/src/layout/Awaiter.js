import React from 'react'
import { observer } from 'mobx-react'

export default observer(({ promise, children }) =>
  promise.case({
    pending: () => <div>Loading...</div>,
    rejected: error => <div>Ooops.. {error}</div>,
    fulfilled: value => <div>{children(value)}</div>,
  })
)
