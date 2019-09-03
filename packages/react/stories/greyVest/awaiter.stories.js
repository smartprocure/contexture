import React from 'react'
import { storiesOf } from '@storybook/react'
import { fromPromise } from 'mobx-utils'
import { Awaiter } from '../../src/greyVest'

storiesOf('Components (Grey Vest)|Awaiter', module).addWithJSX(
  'Awaiter',
  () => {
    let resolve
    let reject
    let p = fromPromise(
      new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
      })
    )
    return (
      <div>
        <Awaiter promise={p}>{x => <div>{x}</div>}</Awaiter>
        <button onClick={() => resolve('async value')}>Resolve</button>
        <button onClick={() => reject('some error')}>Reject</button>
      </div>
    )
  }
)
