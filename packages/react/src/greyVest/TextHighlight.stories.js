import React from 'react'
import F from 'futil'
import Component from './TextHighlight.js'

export default {
  component: Component,
}

let lipsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

export const TextHighlight = () => {
  let filter = React.useState('')
  return (
    <div>
      <div>
        <input {...F.domLens.value(filter)} />
      </div>
      <Component text={lipsum} pattern={F.view(filter)} />
    </div>
  )
}
