import React from 'react'
import { exampleTypes, mockService } from 'contexture-client'
import { storiesOf } from '@storybook/react'
import { QueryWizard as GVQueryWizard } from '../../src/themes/greyVest'
import DefaultQueryWizard from '../../src/queryWizard/'
import ContextureMobx from '../../src/utils/contexture-mobx'
import { componentForType } from '../../src/utils/schema'
import GVDecorator from '../greyVest/decorator'
import { ExampleTypes } from '../DemoControls'
let { TypeMap } = ExampleTypes

let Client = ContextureMobx({
  debug: true,
  types: exampleTypes,
  service: mockService(),
})

let Box = ({ children }) => (
  <div style={{ backgroundColor: 'white' }}>{children}</div>
)

let story = QueryWizard => () => (
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
                    friendlyName: 'This is a really long name',
                  },
                  {
                    type: 'group',
                    key: 'foo',
                    join: 'or',
                    children: [
                      {
                        key: 'foo',
                        type: 'query',
                      },
                      {
                        key: 'bar',
                        type: 'tagsQuery',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'facet',
                key: 'friendly facet',
                friendlyName: 'This is another really long name',
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
)

storiesOf('Search Components (Unthemed)|QueryWizard', module).addWithJSX(
  'Two steps with nested filters',
  story(DefaultQueryWizard)
)

storiesOf('Search Components (Grey Vest)|QueryWizard', module)
  .addDecorator(GVDecorator)
  .addWithJSX('Two steps with nested filters', story(GVQueryWizard))
