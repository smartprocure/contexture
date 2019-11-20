import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { Facet, FacetSelect } from '.'

storiesOf('ExampleTypes|Facet', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Facet', () => <Facet tree={TestTree()} path={['facet']} />)
  .add('FacetSelect', () => <FacetSelect tree={TestTree()} path={['facet']} />)
