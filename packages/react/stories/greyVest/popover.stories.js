import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { observer } from 'mobx-react'
import { useLens } from '../../src/utils/react'
import { Popover } from '../../src/greyVest'

let PopoverDemo = observer(() => {
  let isOpen = useLens(false)
  return (
    <div>
      <Popover isOpen={isOpen}>Some Popover Content</Popover>
      <button onClick={F.on(isOpen)}>Open Popover</button>
    </div>
  )
})

storiesOf('Components|GreyVest library', module).addWithJSX('Popover', () => (
  <PopoverDemo />
))
