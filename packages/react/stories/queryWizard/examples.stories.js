import _ from 'lodash/fp'
import React from 'react'
import { storiesOf } from '@storybook/react'
import {
  QueryWizard,
  FilterButtonList,
  StepsAccordion,
  AccordionStep,
} from '../../src/'
import { mergeOverAll } from 'futil-js'
import { componentForType, schemaFieldProps } from '../../src/utils/schema'
import GVDecorator from '../greyVest/decorator'
import { TypeMap } from '../../src/exampleTypes'
import { tree, fields, types, nodeOverrides } from './config'

let mapNodeToDescription = types => (node, fields) => ({
  description: _.join(' ', [
    _.get([node.field, 'description'], fields) || node.description,
    _.get([node.type, 'description'], types),
  ]),
})

let WizardStory = () => (
  <QueryWizard
    tree={tree}
    path={['root']}
    fields={fields}
    mapNodeToProps={mergeOverAll([
      componentForType(TypeMap),
      schemaFieldProps(['label']),
      mapNodeToDescription(types),
      node => nodeOverrides[node.key],
    ])}
    title="Movies"
  />
)

let AccordionStory = () => (
  <StepsAccordion>
    <AccordionStep isRequired={true} title={<h1>Test title</h1>}>
      <FilterButtonList
        tree={tree}
        fields={fields}
        path={['root', 'step 1']}
        mapNodeToProps={mergeOverAll([
          componentForType(TypeMap),
          schemaFieldProps(['label']),
          mapNodeToDescription(types),
          node => nodeOverrides[node.key],
        ])}
      />
    </AccordionStep>
    <AccordionStep isRequired={false} title={<h1>Quick brown fox</h1>}>
      <FilterButtonList
        tree={tree}
        path={['root', 'step 2']}
        fields={fields}
        mapNodeToProps={mergeOverAll([
          componentForType(TypeMap),
          mapNodeToDescription(types),
          node => nodeOverrides[node.key],
        ])}
      />
    </AccordionStep>
  </StepsAccordion>
)

storiesOf('Search Components (Unthemed)|Wizard', module)
  .addWithJSX('QueryWizard', WizardStory)
  .addWithJSX('Accordion with FilterButtonList', AccordionStory)

storiesOf('Search Components (Grey Vest)|Wizard', module)
  .addDecorator(GVDecorator)
  .addWithJSX('QueryWizard', WizardStory)
  .addWithJSX('Accordion with FilterButtonList', AccordionStory)
