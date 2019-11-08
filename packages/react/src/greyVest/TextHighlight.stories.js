import React from 'react'
import F from 'futil'
import { storiesOf } from '@storybook/react'
import { observer } from 'mobx-react'
import { TextHighlight } from '.'
import decorator from './stories/decorator'

let lipsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
let HighlightDemo = observer(() => {
  let filter = React.useState('')
  return (
    <div>
      <div>
        <input {...F.domLens.value(filter)} />
      </div>
      <TextHighlight text={lipsum} pattern={F.view(filter)} />
    </div>
  )
})

storiesOf('Components|GreyVest Library', module)
  .addDecorator(decorator)
  .addWithJSX('TextHighlight', () => <HighlightDemo />)
