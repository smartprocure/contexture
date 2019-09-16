import React from 'react'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { useLens } from '../utils/react'
import { Modal, Button } from '.'
import decorator from './stories/decorator'

export default {
  title: 'GreyVest Library|Modal',
  component: Modal,
  decorators: [decorator],
}

let ModalDemo = observer(() => {
  let open = useLens(false)
  return (
    <div>
      <Modal open={open}>Some Modal Content</Modal>
      <Button onClick={F.on(open)}>Open Modal</Button>
    </div>
  )
})

export let story = () => <ModalDemo />
