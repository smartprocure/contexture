import React from 'react'
import { observer } from 'mobx-react'

let Awaiter = observer(({ promise, children }) =>
  promise.case({
    pending: () => <div>Loading...</div>,
    rejected: error => <div>Ooops.. {error}</div>,
    fulfilled: value => <div>{children(value)}</div>,
  })
)
Awaiter.displayName = 'Awaiter'

export default Awaiter