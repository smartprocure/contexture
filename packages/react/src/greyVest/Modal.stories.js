import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { observer } from 'mobx-react'
import { useLens } from '../utils/react'
import { Modal, Button } from '.'
import decorator from './stories/decorator'

let ModalDemo = observer(() => {
  let open = useLens(false)
  return (
    <div>
      <Modal open={open}>Some Modal Content</Modal>
      <Button onClick={F.on(open)}>Open Modal</Button>
    </div>
  )
})

storiesOf('Components|GreyVest Library', module)
  .addDecorator(decorator)
  .addWithJSX('Modal', () => <ModalDemo />)
