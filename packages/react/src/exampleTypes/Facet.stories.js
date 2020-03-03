import React from 'react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { Facet, FacetSelect } from '.'

export default {
  title: 'ExampleTypes | Facet',
  component: Facet,
  decorators: [ThemePicker('greyVest')],
}

export let facet = () => <Facet tree={TestTree()} path={['facet']} />

export let facetSelect = () => (
  <FacetSelect tree={TestTree()} path={['facet']} />
)
