import React from 'react'
import { fromPromise } from 'mobx-utils'
import { Awaiter, Button, Box } from '.'
import decorator from './stories/decorator'

export default {
  title: 'GreyVest Library|Awaiter',
  decorators: [decorator],
  component: Awaiter,
}

export let story = () => {
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
        <Awaiter promise={p}>{x => <div>{x}</div>}</Awaiter>
      </Box>
      <Button onClick={() => resolve('async value')} style={{ marginRight: 8 }}>
        Resolve
      </Button>
      <Button onClick={() => reject('some error')}>Reject</Button>
    </>
  )
}
