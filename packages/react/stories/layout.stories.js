import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { observer } from 'mobx-react'
import { fromPromise } from 'mobx-utils'
import { withStateLens } from '../src/utils/mobx-react-utils'
import Popover from '../src/layout/Popover'
import Modal from '../src/layout/Modal'
import Awaiter from '../src/layout/Awaiter'
import TextHighlight from '../src/layout/TextHighlight'
import { Flex } from '../src/layout/Flex'
import { NestedPicker, ModalPicker } from '../src'

let ModalDemo = withStateLens({ isOpen: false })(
  observer(({ isOpen }) => (
    <div>
      <Modal isOpen={isOpen}>Some Modal Content</Modal>
      <button onClick={F.on(isOpen)}>Open Modal</button>
    </div>
  ))
)

let PopoverDemo = withStateLens({ isOpen: false })(
  observer(({ isOpen }) => (
    <div>
      <Popover isOpen={isOpen}>Some Popover Content</Popover>
      <button onClick={F.on(isOpen)}>Open Popover</button>
    </div>
  ))
)

let lipsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
let HighlightDemo = withStateLens({ filter: '' })(
  observer(({ filter }) => (
    <div>
      <div>
        <input {...F.domLens.value(filter)} />
      </div>
      <TextHighlight text={lipsum} pattern={F.view(filter)} />
    </div>
  ))
)

let FlexDemo = ({ style, ...props }) => (
  <Flex
    wrap
    justifyContent="center"
    style={{
      backgroundColor: 'lightblue',
      fontSize: '2em',
      maxWidth: 300,
      ...style,
    }}
    {...props}
  >
    <div>Item1</div>
    <div>Item2</div>
    <div>Item2</div>
    <div>Item4</div>
    <div>Item5</div>
    <div>Item6</div>
  </Flex>
)

storiesOf('Components (Unthemed)|Layout', module)
  .addWithJSX('Popover', () => <PopoverDemo />)
  .addWithJSX('Modal', () => <ModalDemo />)
  .addWithJSX('Highlight', () => <HighlightDemo />)
  .addWithJSX('Flex', () => (
    <>
      <Flex column alignItems="center">
        <h1>As button</h1>
        <FlexDemo as="button" />
      </Flex>
      <Flex column alignItems="center">
        <h1>No children</h1>
        <Flex />
      </Flex>
    </>
  ))
  .addWithJSX('Awaiter', () => {
    let resolve
    let reject
    let p = fromPromise(
      new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
      })
    )
    return (
      <div>
        <Awaiter promise={p}>{x => <div>{x}</div>}</Awaiter>
        <button onClick={() => resolve('async value')}>Resolve</button>
        <button onClick={() => reject('some error')}>Reject</button>
      </div>
    )
  })
  .addWithJSX('NestedPicker', () => (
    <NestedPicker
      options={['abcd', 'bcde', 'cdef'].map(x => ({ label: x, value: x }))}
      onChange={action(`picked`)}
    />
  ))
  .addWithJSX('ModalPicker', () => (
    <ModalPicker
      options={['abcd', 'bcde', 'cdef'].map(x => ({ label: x, value: x }))}
      onChange={action('picked')}
      label="Pick"
      Picker={NestedPicker}
      Modal={Modal}
    />
  ))
