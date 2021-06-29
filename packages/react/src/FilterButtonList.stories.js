import React from 'react'
import { storiesOf } from '@storybook/react'
import {
  applyDefaults,
  componentForType,
  schemaFieldProps,
} from './utils/schema'
import ThemePicker from './stories/themePicker'
import FilterButtonList from './FilterButtonList'
import {
  tree,
  fields,
  nodeOverrides,
  types,
} from './queryWizard/stories/config'
import { mergeOverAll } from 'futil'
import { TypeMap } from './exampleTypes'
import _ from 'lodash/fp'

let mapNodeToDescription = (node, fields) => ({
  description: _.join(' ', [
    _.get([node.field, 'description'], fields) || node.description,
    _.get([node.type, 'description'], types),
  ]),
})

storiesOf('Search Components|FilterButtonList', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Simple', () => (
    <div>
      <FilterButtonList
        tree={tree}
        path={['root', 'step 1', 'foop']}
        fields={applyDefaults(fields)}
        mapNodeToProps={mergeOverAll([
          componentForType(TypeMap),
          schemaFieldProps(['label']),
          mapNodeToDescription,
          node => nodeOverrides[node.key],
        ])}
      />
    </div>
  ))
  .add('With Filter Adder', () => (
    <div>
      <FilterButtonList
        tree={tree}
        path={['root', 'step 1', 'foop']}
        fields={applyDefaults(fields)}
        mapNodeToProps={mergeOverAll([
          componentForType(TypeMap),
          schemaFieldProps(['label']),
          mapNodeToDescription,
          node => nodeOverrides[node.key],
        ])}
        addFilters="Add Filters"
      />
    </div>
  ))
  .add('With Nested Nodes', () => (
    <div>
      <FilterButtonList
        tree={tree}
        path={['root']}
        fields={applyDefaults(fields)}
        mapNodeToProps={mergeOverAll([
          componentForType(TypeMap),
          schemaFieldProps(['label']),
          mapNodeToDescription,
          node => nodeOverrides[node.key],
        ])}
        addFilters
      />
    </div>
  ))
