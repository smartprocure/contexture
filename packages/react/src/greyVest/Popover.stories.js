import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { observable } from 'mobx'
import { useTheme } from '../utils/theme'
import decorator from './stories/decorator'

let PopoverDemo = () => {
  let open = observable.box(false)
  let { Popover, Button } = useTheme()
  return (
    <div>
      <Button onClick={F.on(open)}>Open Popover</Button>
      <Popover open={open}>Some Popover Content</Popover>
    </div>
  )
}

storiesOf('Components|GreyVest Library', module)
  .addDecorator(decorator)
  .addWithJSX('Popover', PopoverDemo)
