import React from 'react'
import TestTree from './stories/testTree.js'
import ThemePicker from '../stories/themePicker.js'
import { useMemoryTree } from '../MemoryTable.js'
import { Grid, Box } from '../greyVest/index.js'
import { Facet, FacetSelect, ResultTable } from './index.js'

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
