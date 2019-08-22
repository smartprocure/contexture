import _ from 'lodash/fp'
import React from 'react'
import { storiesOf } from '@storybook/react'
import {
  QueryWizard as GVQueryWizard,
  FilterButtonList as GVFilterButtonList,
  StepsAccordion as GVStepsAccordion,
  AccordionStep as GVAccordionStep,
} from '../../src/greyVest'
import DefaultQueryWizard from '../../src/queryWizard/QueryWizard'
import {
  StepsAccordion as DefaultStepsAccordion,
  AccordionStep as DefaultAccordionStep,
} from '../../src/layout'
import DefaultFilterButtonList from '../../src/FilterButtonList'
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

let wizardStory = QueryWizard => () => (
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

let accordionStory = (
  StepsAccordion,
  AccordionStep,
  FilterButtonList
) => () => (
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
  .addWithJSX('QueryWizard', wizardStory(DefaultQueryWizard))
  .addWithJSX(
    'Accordion with FilterButtonList',
    accordionStory(
      DefaultStepsAccordion,
      DefaultAccordionStep,
      DefaultFilterButtonList
    )
  )

storiesOf('Search Components (Grey Vest)|Wizard', module)
  .addDecorator(GVDecorator)
  .addWithJSX('QueryWizard', wizardStory(GVQueryWizard))
  .addWithJSX(
    'Accordion with FilterButtonList',
    accordionStory(GVStepsAccordion, GVAccordionStep, GVFilterButtonList)
  )
