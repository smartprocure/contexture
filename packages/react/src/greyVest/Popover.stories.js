import React, { useState } from 'react'
import F from 'futil'
import { Button } from './index.js'
import Component from './Popover.js'

export default {
  component: Component,
}

export let WithOpenProp = () => {
  let open = useState(false)
  return (
    <Component
      open={open}
      trigger={<Button onClick={F.on(open)}>Open Popover</Button>}
    >
      Some Popover Content
    </Component>
  )
}

export let WithIsOpenOnCloseProps = () => {
  let [isOpen, setIsOpen] = React.useState(false)
  return (
    <Component
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={<Button onClick={() => setIsOpen(true)}>Open Popover</Button>}
    >
      Some Popover Content
    </Component>
  )
}

export let WithTriggerProp = () => (
  <Component trigger={<Button>Open Popover</Button>}>
    Some Popover Content
  </Component>
)
