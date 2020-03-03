import React from 'react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { memoryService } from '../MemoryTable'
import ContextureMobx from '../utils/contexture-mobx'
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
  let data = require('emoji-datasource')
  let service = memoryService(data)
  let tree = ContextureMobx({ service })({
    key: 'root',
    children: [{ type: 'facet', field: 'category' }, { type: 'results' }],
  })
  tree.refresh(['root'])
  return (
    <Grid columns="1fr 3fr" gap={8}>
      <Box>
        <Facet tree={tree} path={['root', 'category-facet']} />
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
