import React from 'react'
import F from 'futil-js'
import { observable } from 'mobx'
import { storiesOf } from '@storybook/react'
import { useTheme } from '../utils/theme'
import decorator from './stories/decorator'

let ModalDemo = () => {
  let open = observable.box(false)
  let { Modal, Button } = useTheme()
  return (
    <>
      <Button onClick={F.on(open)}>Open Modal</Button>
      <Modal open={open}>Some Modal Content</Modal>
    </>
  )
}

storiesOf('Components|GreyVest Library', module)
  .addDecorator(decorator)
  .addWithJSX('Modal', ModalDemo)
