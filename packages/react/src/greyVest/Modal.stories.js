import React from 'react'
import F from 'futil-js'
import { useLens } from '../utils/react'
import { Modal, Button } from '.'
import decorator from './stories/decorator'

export default {
  title: 'GreyVest Library|Modal',
  component: Modal,
  decorators: [decorator],
}

export let withOpenProp = () => {
  let open = useLens(false)
  return (
    <>
      <Modal open={open}>Some Modal Content</Modal>
      <Button onClick={F.on(open)}>Open Modal</Button>
    </>
  )
}
withOpenProp.story = { name: "With 'open' prop" }

export let withIsOpenOnCloseProps = () => {
  let [isOpen, setIsOpen] = React.useState(false)
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        Some Modal Content
      </Modal>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
    </>
  )
}
withIsOpenOnCloseProps.story = { name: "With 'isOpen'/'onClose' props" }
