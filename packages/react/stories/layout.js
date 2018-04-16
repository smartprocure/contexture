import React from 'react'
import * as F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { observer } from 'mobx-react'
import { fromPromise } from 'mobx-utils'
import { withStateLens } from '../src/utils/mobx-react-utils'
import Popover from '../src/layout/Popover'
import Modal from '../src/layout/Modal'
import Awaiter from '../src/layout/Awaiter'

let ModalDemo = withStateLens({ isOpen: false })(
  observer(
    ({ isOpen }) => (
      <div>
        <Modal isOpen={isOpen}>
          Some Modal Content
        </Modal>
        <button onClick={F.on(isOpen)}>Open Modal</button>
      </div>
    )
  )
)

let PopoverDemo = withStateLens({ isOpen: false })(
  observer(
    ({ isOpen }) => (
      <div>
        <Popover isOpen={isOpen}>
          Some Popover Content
        </Popover>
        <button onClick={F.on(isOpen)}>Open Popover</button>
      </div>
    )
  )
)

export default () => {
  storiesOf('Layout', module)
    .add('Popover', () => <PopoverDemo />)
    .add('Modal', () => <ModalDemo />)
    .add('Awaiter', () => {
      let resolve, reject
      let p = fromPromise(new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
      }))
      return <div>
        <Awaiter promise={p}>
          {x => (
            <div>{x}</div>
          )}
        </Awaiter>
        <button onClick={() => resolve('async value')}>Resolve</button>
        <button onClick={() => reject('some error')}>Reject</button>
      </div>
    })
}
