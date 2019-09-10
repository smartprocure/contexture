import React from 'react'
import { storiesOf } from '@storybook/react'
import { fromPromise } from 'mobx-utils'
import { Awaiter, Button, Box } from '../../src/greyVest'
import decorator from './decorator'

storiesOf('Components|GreyVest Library/', module)
  .addDecorator(decorator)
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
      <>
        <Box>
          <Awaiter promise={p}>{x => <div>{x}</div>}</Awaiter>
        </Box>
        <Button
          onClick={() => resolve('async value')}
          style={{ marginRight: 8 }}
        >
          Resolve
        </Button>
        <Button onClick={() => reject('some error')}>Reject</Button>
      </>
    )
  })
