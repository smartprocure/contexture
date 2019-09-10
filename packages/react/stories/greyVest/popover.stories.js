import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { observer } from 'mobx-react'
import { useLens } from '../../src/utils/react'
import { useTheme } from '../../src/utils/theme'
import decorator from './decorator'

let PopoverDemo = observer(() => {
  let open = useLens(false)
  let { Popover, Button } = useTheme()
  return (
    <div>
      <Popover open={open}>Some Popover Content</Popover>
      <Button onClick={F.on(open)}>Open Popover</Button>
    </div>
  )
})

storiesOf('Components|GreyVest Library', module)
  .addDecorator(decorator)
  .addWithJSX('Popover', () => <PopoverDemo />)
