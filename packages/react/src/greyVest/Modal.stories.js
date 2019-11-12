import React from 'react'
import F from 'futil'
import { observable } from 'mobx'
import { storiesOf } from '@storybook/react'
import { useTheme } from '../utils/theme'
import decorator from './stories/decorator'
import { useLensObject } from '../utils/react'

storiesOf('Components|GreyVest Library/Modal', module)
  .addDecorator(decorator)
  .addWithJSX('With open prop', () => {
    let open = observable.box(false)
    let { Modal, Button } = useTheme()
    return (
      <>
        <Button onClick={F.on(open)}>Open Modal</Button>
        <Modal open={open}>Some Modal Content</Modal>
      </>
    )
  })
  .addWithJSX('With isOpen/onClose props', () => {
    let [isOpen, setIsOpen] = React.useState(false)
    let { Modal, Button } = useTheme()
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          Some Modal Content
        </Modal>
      </>
    )
  })
  .addWithJSX('From popover', () => {
    let open = useLensObject({ modal: false, popover: false })

    let { Modal, Button, Popover, DropdownItem } = useTheme()
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
  })
