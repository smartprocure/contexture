import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { observer } from 'mobx-react'
import { useLens } from '../../src/utils/react'
import { useTheme } from '../../src/utils/theme'
import decorator from './decorator'

let PopoverDemo = observer(() => {
  let isOpen = useLens(false)
  let { Popover, Button } = useTheme()
  return (
    <div>
      <Popover isOpen={isOpen}>Some Popover Content</Popover>
      <Button onClick={F.on(isOpen)}>Open Popover</Button>
    </div>
  )
})

storiesOf('Components|GreyVest library', module)
  .addDecorator(decorator)
  .addWithJSX('Popover', () => <PopoverDemo />)
