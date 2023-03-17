import React from 'react'
import { fromPromise } from 'mobx-utils'
import Component from './Awaiter.js'
import { Button, Box } from './index.js'

export default {
  component: Component,
}

export const Awaiter = () => {
  let resolve
  let reject
  let p = fromPromise(
    new Promise((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
    })
  )
  return (
    <>
      <Box>
        <Component promise={p}>{(x) => <div>{x}</div>}</Component>
      </Box>
      <Button onClick={() => resolve('async value')} style={{ marginRight: 8 }}>
        Resolve
      </Button>
      <Button onClick={() => reject('some error')}>Reject</Button>
    </>
  )
}
