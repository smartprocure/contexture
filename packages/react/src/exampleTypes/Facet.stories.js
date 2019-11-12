import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { Facet, FacetSelect } from '.'

storiesOf('Components|ExampleTypes', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('Facet', () => <Facet tree={TestTree()} path={['facet']} />)
  .addWithJSX('FacetSelect', () => (
    <FacetSelect tree={TestTree()} path={['facet']} />
  ))
