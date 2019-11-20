import React from 'react'
import F from 'futil'
import { useLensObject } from '../utils/react'
import { Modal, Button, Popover, DropdownItem } from '.'
import decorator from './stories/decorator'

export default {
  title: 'GreyVest Library|Modal',
  component: Modal,
  decorators: [decorator],
}

export let withOpenProp = () => {
  let open = React.useState(false)
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

export let fromPopover = () => {
  let open = useLensObject({ modal: false, popover: false })
  return (
    <>
      <p>
        Demonstrates how to use modals inside of popovers. Ideally, the modal
        component should live outside the popover even if its opener is inside
        the popover, but in cases where it's absolutely necessary, modals can
        survive inside of popovers as long as steps are taken to keep the
        popover open as long as the modal is.
      </p>
      <Button onClick={F.on(open.popover)}>Open Popover</Button>
      <Popover
        isOpen={F.view(open.popover)}
        onClose={() => !F.view(open.modal) && F.off(open.popover)()}
      >
        <DropdownItem onClick={F.on(open.modal)}>Open Modal</DropdownItem>
        <Modal open={open.modal}>Some modal content</Modal>
      </Popover>
    </>
  )
}
