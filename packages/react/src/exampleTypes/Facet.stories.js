import React from 'react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { useMemoryTree } from '../MemoryTable'
import { Grid, Box } from '../greyVest'
import { Facet, FacetSelect, ResultTable } from '.'

export default {
  title: 'ExampleTypes | Facet',
  component: Facet,
  decorators: [ThemePicker('greyVest')],
}

export let facet = () => <Facet tree={TestTree()} path={['facet']} />

export let facetSelect = () => (
  <FacetSelect tree={TestTree()} path={['facet']} />
)

export let emojiDataset = () => {
  let tree = useMemoryTree({
    records: require('emoji-datasource'),
    criteriaNodes: [{ type: 'facet', field: 'category' }],
  })

  return (
    <Grid columns="1fr 3fr" gap={8}>
      <Box>
        <Facet tree={tree} path={['root', 'criteria', 'category-facet']} />
      </Box>
      <Box style={{ overflow: 'auto' }}>
        <ResultTable
          infer
          tree={tree}
          path={['root', 'results']}
          fields={{ category: { order: 1 } }}
        />
      </Box>
    </Grid>
  )
}
