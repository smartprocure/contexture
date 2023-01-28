import React from 'react'
import ShowFiltersButton from './purgatory/ShowFiltersButton.js'
import { Flex } from './greyVest/index.js'

let ToggleFiltersHeader = ({ mode, setMode, children }) => (
  <Flex style={{ alignItems: 'center' }}>
    {setMode && mode === 'resultsOnly' && (
      <span style={{ marginRight: 5 }}>
        <ShowFiltersButton onClick={() => setMode('basic')} />
      </span>
    )}
    <h1>{children}</h1>
  </Flex>
)

export default ToggleFiltersHeader
