
import React from 'react'
import { storiesOf } from '@storybook/react'
import decorator from './decorator'
import { SearchLayout, Box } from './../../src/themes/greyVest'

storiesOf('Components (Grey Vest)|Search Layout', module)
  .addDecorator(decorator)
  .addWithJSX('Basic', () => (
    <SearchLayout mode="basic">
      <Box>Filters</Box>
      <Box>Results</Box>
    </SearchLayout>
  ))
  .addWithJSX('Builder', () => (
    <SearchLayout mode="builder">
      <Box>Filters</Box>
      <Box>Results</Box>
    </SearchLayout>
  ))
  .addWithJSX('Results Only', () => (
    <SearchLayout mode="resultsOnly">
      {/* <Box>Filters</Box> */}
      <Box>Results</Box>
    </SearchLayout>
  ))

