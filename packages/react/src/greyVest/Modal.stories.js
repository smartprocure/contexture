import React from 'react'
import F from 'futil'
import { useLensObject } from '../utils/react.js'
import { Button, Popover, DropdownItem } from './index.js'
import Component from './Modal.js'

export default {
  component: Component,
}

export const WithOpenProp = () => {
  let open = React.useState(false)
  return (
    <>
      <Component open={open}>Some Modal Content</Component>
      <Button onClick={F.on(open)}>Open Modal</Button>
    </>
  )
}

export const WithIsOpenOnCloseProps = () => {
  let [isOpen, setIsOpen] = React.useState(false)
  return (
    <>
      <Component isOpen={isOpen} onClose={() => setIsOpen(false)}>
        Some Modal Content
      </Component>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
    </>
  )
}

export const FromPopover = () => {
  let open = useLensObject({ modal: false, popover: false })
  return (
    <>
      <p>
        Demonstrates how to use modals inside of popovers. Ideally, the modal
        component should live outside the popover even if its opener is inside
        the popover, but in cases where it is absolutely necessary, modals can
        survive inside of popovers as long as steps are taken to keep the
        popover open as long as the modal is.
      </p>
      <Button onClick={F.on(open.popover)}>Open Popover</Button>
      <Popover
        isOpen={F.view(open.popover)}
        onClose={() => !F.view(open.modal) && F.off(open.popover)()}
      >
        <DropdownItem onClick={F.on(open.modal)}>Open Modal</DropdownItem>
        <Component open={open.modal}>Some modal content</Component>
      </Popover>
    </>
  )
}
