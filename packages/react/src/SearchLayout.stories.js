import React from 'react'
import { Box } from './greyVest/index.js'
import Component from './SearchLayout.js'

export default {
  component: Component,
}

export const Basic = () => (
  <Component mode="basic">
    <Box>Filters</Box>
    <Box>Results</Box>
  </Component>
)

export const Builder = () => (
  <Component mode="builder">
    <Box>Filters</Box>
    <Box>Results</Box>
  </Component>
)

export const ResultsOnly = () => (
  <Component mode="resultsOnly">
    <Box>Results</Box>
  </Component>
)
