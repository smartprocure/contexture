import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { observer } from 'mobx-react'
import { useLens } from '../../src/utils/react'
import { Modal } from '../../src/greyVest'

let ModalDemo = observer(() => {
  let isOpen = useLens(false)
  return (
    <div>
      <Modal isOpen={isOpen}>Some Modal Content</Modal>
      <button onClick={F.on(isOpen)}>Open Modal</button>
    </div>
  )
})

storiesOf('Components (Grey Vest)|Modal', module).addWithJSX('Modal', () => (
  <ModalDemo />
))
