import React from 'react'
import { storiesOf } from '@storybook/react'
import { SearchLayout } from '../../src'
import { Box } from '../../src/greyVest'
import ThemePicker from '../themePicker'

storiesOf('Components|Search components/SearchLayout', module)
  .addDecorator(ThemePicker('greyVest'))
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
