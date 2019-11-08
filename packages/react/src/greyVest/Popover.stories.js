import React from 'react'
import F from 'futil'
import { observable } from 'mobx'
import { storiesOf } from '@storybook/react'
import { useTheme } from '../utils/theme'
import decorator from './stories/decorator'

storiesOf('Components|GreyVest Library/Popover', module)
  .addDecorator(decorator)
  .addWithJSX('With open prop', () => {
    let open = observable.box(false)
    let { Popover, Button } = useTheme()
    return (
      <>
        <Button onClick={F.on(open)}>Open Popover</Button>
        <Popover open={open}>Some Popover Content</Popover>
      </>
    )
  })
  .addWithJSX('With isOpen/onClose props', () => {
    let [isOpen, setIsOpen] = React.useState(false)
    let { Popover, Button } = useTheme()
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Popover</Button>
        <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
          Some Popover Content
        </Popover>
      </>
    )
  })
