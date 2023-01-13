import React, { useState } from 'react'
import F from 'futil'
import { Button, Popover } from './index.js'
import decorator from './stories/decorator.js'

export default {
  title: 'GreyVest Library|Popover',
  component: Popover,
  decorators: [decorator],
}

export let withOpenProp = () => {
  let open = useState(false)
  return (
    <>
      <Popover
        open={open}
        trigger={<Button onClick={F.on(open)}>Open Popover</Button>}
      >
        Some Popover Content
      </Popover>
    </>
  )
}
withOpenProp.story = { name: "With 'open' prop" }

export let withIsOpenOnCloseProps = () => {
  let [isOpen, setIsOpen] = React.useState(false)
  return (
    <>
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        trigger={<Button onClick={() => setIsOpen(true)}>Open Popover</Button>}
      >
        Some Popover Content
      </Popover>
    </>
  )
}
withIsOpenOnCloseProps.story = { name: "With 'isOpen'/'onClose' props" }

export let withTriggerProp = () => (
  <>
    <Popover trigger={<Button>Open Popover</Button>}>
      Some Popover Content
    </Popover>
  </>
)
withTriggerProp.story = { name: 'With trigger Component' }
