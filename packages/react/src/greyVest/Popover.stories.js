import React from 'react'
import F from 'futil-js'
import { observable } from 'mobx'
import { Button, Popover } from '.'
import decorator from './stories/decorator'

export default {
  title: 'GreyVest Library|Popover',
  component: Popover,
  decorators: [decorator],
}

export let withLens = () => {
  let open = observable.box(false)
  return (
    <>
      <Button onClick={F.on(open)}>Open Popover</Button>
      <Popover open={open}>Some Popover Content</Popover>
    </>
  )
}
withLens.story = { name: "With 'open' prop" }

export let withValueSetter = () => {
  let [isOpen, setIsOpen] = React.useState(false)
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Popover</Button>
      <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
        Some Popover Content
      </Popover>
    </>
  )
}
withValueSetter.story = { name: "With 'isOpen'/'onClose' props" }
