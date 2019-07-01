import React from 'react'
import { storiesOf } from '@storybook/react'
import { exampleTypes, mockService } from 'contexture-client'
import ContextureMobx from '../../src/utils/contexture-mobx'
import QueryWizard from '../../src/queryWizard/'
import { componentForType } from '../../src/utils/schema'
import { ExampleTypes } from '../DemoControls'
let { TypeMap } = ExampleTypes

let Client = ContextureMobx({
  debug: true,
  types: exampleTypes,
  service: mockService(),
})

storiesOf('Search Components (Unthemed)|QueryWizard', module)
  .addWithJSX('One Filter', () => (
    <QueryWizard
      tree={Client({
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'step 1',
            friendlyName: 'Friendly Group',
            type: 'group',
            join: 'and',
            children: [
              {
                type: 'tagsQuery',
                key: 'friendly node',
                friendlyName: 'Friendly Node',
                typeDescription: 'Enter some tags',
                fieldDescription: 'Search for stuff',
              },
            ],
          },
        ],
      })}
      path={['root']}
      mapNodeToProps={componentForType(TypeMap)}
    />
  ))
  .addWithJSX('Two Filters', () => (
    <QueryWizard
      tree={Client({
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'step 1',
            friendlyName: 'Friendly Group',
            type: 'group',
            join: 'and',
            children: [
              {
                type: 'tagsQuery',
                key: 'friendly node',
                friendlyName: 'Friendly Node',
                typeDescription: 'Enter some tags',
                fieldDescription: 'Search for stuff',
              },
              {
                type: 'facet',
                key: 'friendly facet',
                friendlyName: 'Facet',
                typeDescription: 'Select some checkboxes or whatever',
                fieldDescription: 'Search for stuff',
              },
            ],
          },
        ],
      })}
      path={['root']}
      mapNodeToProps={componentForType(TypeMap)}
    />
  ))
  .addWithJSX('Two Steps with nested filters', () => (
    <QueryWizard
      tree={Client({
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'step 1',
            friendlyName: 'Friendly Group',
            type: 'group',
            join: 'and',
            children: [
              {
                type: 'tagsQuery',
                key: 'friendly node',
                friendlyName: 'Friendly Node',
                typeDescription: 'Enter some tags',
                fieldDescription: 'Search for stuff',
              },
              {
                type: 'group',
                join: 'and',
                children: [
                  {
                    type: 'query',
                    key: 'bar',
                    friendlyName: 'Bar',
                  },
                  {
                    type: 'tagsQuery',
                    key: 'foo',
                    friendlyName: 'Foo',
                  },
                ],
              },
              {
                type: 'facet',
                key: 'friendly facet',
                friendlyName: 'Facet',
                typeDescription: 'Select some checkboxes or whatever',
                fieldDescription: 'Search for stuff',
              },
            ],
          },
          {
            key: 'step 2',
            friendlyName: 'Step 2',
            type: 'group',
            join: 'and',
            children: [
              {
                type: 'tagsQuery',
                key: 'friendly node',
                friendlyName: 'Friendly Node',
                typeDescription: 'Enter some tags',
                fieldDescription: 'Search for stuff',
              },
              {
                type: 'facet',
                key: 'friendly facet',
                friendlyName: 'Facet',
                typeDescription: 'Select some checkboxes or whatever',
                fieldDescription: 'Search for stuff',
              },
            ],
          },
        ],
      })}
      path={['root']}
      mapNodeToProps={componentForType(TypeMap)}
    />
  ))
