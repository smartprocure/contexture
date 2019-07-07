import React from 'react'
import { exampleTypes, mockService } from 'contexture-client'
import { storiesOf } from '@storybook/react'
import { QueryWizard as GVQueryWizard } from '../../src/themes/greyVest'
import DefaultQueryWizard from '../../src/queryWizard/QueryWizard'
import WizardAccordion from '../../src/queryWizard/WizardAccordion'
import FilterButtonList from '../../src/FilterButtonList'
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

let tree = Client({
  key: 'root',
  join: 'and',
  children: [
    {
      key: 'step 1',
      label: 'Friendly Group',
      type: 'group',
      join: 'and',
      children: [
        {
          type: 'tagsQuery',
          key: 'friendly node',
          label: 'Friendly Node',
          typeDescription: 'Enter some tags',
          fieldDescription: 'Search for stuff',
        },
        {
          key: 'foop',
          type: 'group',
          join: 'and',
          children: [
            {
              type: 'query',
              key: 'bar',
              label: 'This is a really long name',
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
})

let story = QueryWizard => () => (
  <Box>
    <QueryWizard
      tree={tree}
      path={['root']}
      mapNodeToProps={componentForType(TypeMap)}
    />
  </Box>
)

let story2 = Wizard => () => (
  <Box>
    <Wizard>
      <FilterButtonList
        tree={tree}
        node={tree.getNode(['root', 'step 1'])}
        mapNodeToProps={componentForType(TypeMap)}
        isRequired={true}
        stepTitle="Test title"
      />
      <FilterButtonList
        tree={tree}
        node={tree.getNode(['root', 'step 2'])}
        mapNodeToProps={componentForType(TypeMap)}
        isRequired={false}
        stepTitle="Quick brown fox"
      />
    </Wizard>
  </Box>
)

storiesOf('Search Components (Unthemed)|QueryWizard', module)
  .addWithJSX('Two steps with nested filters', story(DefaultQueryWizard))
  .addWithJSX('StepsWizard', story2(WizardAccordion))

storiesOf('Search Components (Grey Vest)|QueryWizard', module)
  .addDecorator(GVDecorator)
  .addWithJSX('Two steps with nested filters', story(GVQueryWizard))
  .addWithJSX('StepsWizard', story2(WizardAccordion))
