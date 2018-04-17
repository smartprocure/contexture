import React from 'react'
import * as F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { observer } from 'mobx-react'
import { fromPromise } from 'mobx-utils'
import { withStateLens } from '../src/utils/mobx-react-utils'
import { value } from '../src/utils/actout'
import Popover from '../src/layout/Popover'
import Modal from '../src/layout/Modal'
import Awaiter from '../src/layout/Awaiter'
import TextHighlight from '../src/layout/TextHighlight'
import { FilteredPicker, ModalPicker } from '../src/layout/Pickers'

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

let lipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
let HighlightDemo = withStateLens({filter: ''})(
  observer(({filter}) => (
    <div>
      <div>
        <input {...value(filter)} />
      </div>
      <TextHighlight text={lipsum} pattern={F.view(filter)} />
    </div>
  ))
)

export default () => {
  storiesOf('Layout', module)
    .add('Popover', () => <PopoverDemo />)
    .add('Modal', () => <ModalDemo />)
    .add('Highlight', () => <HighlightDemo />)
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
    .add('FilteredPicker', () => <FilteredPicker
      options={['abcd', 'bcde', 'cdef'].map(x => ({label:x, value:x}))}
      onChange={action(`picked`)}
    />)
    .add('ModalPicker', () => <ModalPicker
      options={['abcd', 'bcde', 'cdef'].map(x => ({label:x, value:x}))}
      onChange={action('picked')}
      label='Pick'
      Picker={FilteredPicker}
      Modal={Modal}
    />)
}
