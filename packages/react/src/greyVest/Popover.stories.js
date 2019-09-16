import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { observer } from 'mobx-react'
import { useLens } from '../utils/react'
import { useTheme } from '../utils/theme'
import decorator from './stories/decorator'

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
  .add('Popover', () => <PopoverDemo />)
