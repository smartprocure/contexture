import React from 'react'
import { storiesOf } from '@storybook/react'
import { Box } from './greyVest'
import ThemePicker from './stories/themePicker'
import { SearchLayout } from '.'

storiesOf('Components|Search Components/SearchLayout', module)
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
