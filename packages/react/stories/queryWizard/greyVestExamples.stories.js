import React from 'react'
import { storiesOf } from '@storybook/react'
import { exampleTypes, mockService } from 'contexture-client'
import ContextureMobx from '../../src/utils/contexture-mobx'
import { QueryWizard } from '../../src/themes/greyVest'
import { componentForType } from '../../src/utils/schema'
import GVDecorator from '../greyVest/decorator'
import { ExampleTypes } from '../DemoControls'
let { TypeMap } = ExampleTypes

let Client = ContextureMobx({
  debug: true,
  types: exampleTypes,
  service: mockService(),
})

let Box = ({children}) => <div style={{backgroundColor: 'white'}}>{children}</div>

storiesOf('Search Components (Grey Vest)|QueryWizard', module)
  .addDecorator(GVDecorator)
  .addWithJSX('One Filter', () => (
    <Box>
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
    </Box>
  ))
  .addWithJSX('Two Filters', () => (
    <Box>
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
    </Box>
  ))
  .addWithJSX('Two Steps with nested filters', () => (
    <Box>
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
    </Box>
  ))
