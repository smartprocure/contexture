import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { observer } from 'mobx-react'
import { useLens } from '../../src/utils/react'
import { Modal, Button } from '../../src/greyVest'
import decorator from './decorator'

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
