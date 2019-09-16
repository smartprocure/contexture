import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { Box } from './greyVest'
import { default as ThemePicker } from './stories/themePicker'
import { SearchLayout } from '.'

storiesOf('Components|Search Components/SearchLayout', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Basic', () => (
    <SearchLayout mode="basic">
      <Box>Filters</Box>
      <Box>Results</Box>
    </SearchLayout>
  ))
  .add('Builder', () => (
    <SearchLayout mode="builder">
      <Box>Filters</Box>
      <Box>Results</Box>
    </SearchLayout>
  ))
  .add('Results Only', () => (
    <SearchLayout mode="resultsOnly">
      {/* <Box>Filters</Box> */}
      <Box>Results</Box>
    </SearchLayout>
  ))
