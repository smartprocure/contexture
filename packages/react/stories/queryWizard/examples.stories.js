import _ from 'lodash/fp'
import React from 'react'
import { storiesOf } from '@storybook/react'
import {
  QueryWizard as GVQueryWizard,
  FilterButtonList as GVFilterButtonList,
  StepsAccordion as GVStepsAccordion,
} from '../../src/themes/greyVest'
import DefaultQueryWizard from '../../src/queryWizard/QueryWizard'
import DefaultStepsAccordion from '../../src/queryWizard/StepsAccordion'
import DefaultFilterButtonList from '../../src/FilterButtonList'
import { componentForType } from '../../src/utils/schema'
import GVDecorator from '../greyVest/decorator'
import { ExampleTypes } from '../DemoControls'
import { mapNodeToDescription } from './utils'
import { tree, fields, types, nodeOverrides } from './config'
let { TypeMap } = ExampleTypes

let story = QueryWizard => () => (
  <QueryWizard
    tree={tree}
    path={['root']}
    fields={fields}
    mapNodeToProps={componentForType(TypeMap)}
    mapNodeToLabel={(node, fields) => _.get([node.field, 'label'], fields)}
    mapNodeToDescription={mapNodeToDescription(types)}
    title="Movies"
  />
)

let story2 = (StepsAccordion, FilterButtonList) => () => (
  <StepsAccordion>
    <FilterButtonList
      tree={tree}
      fields={fields}
      path={['root', 'step 1']}
      mapNodeToProps={componentForType(TypeMap)}
      isRequired={true}
      stepTitle="Test title"
    />
    <FilterButtonList
      tree={tree}
      path={['root', 'step 2']}
      fields={fields}
      mapNodeToProps={(node, fields) =>
        _.merge(
          componentForType(TypeMap)(node, fields),
          nodeOverrides[node['key']]
        )
      }
      mapNodeToDescription={mapNodeToDescription(types)}
      isRequired={false}
      stepTitle="Quick brown fox"
    />
  </StepsAccordion>
)

storiesOf('Search Components (Unthemed)|Wizard', module)
  .addWithJSX('QueryWizard', story(DefaultQueryWizard))
  .addWithJSX(
    'Accordion with FilterButtonList',
    story2(DefaultStepsAccordion, DefaultFilterButtonList)
  )

storiesOf('Search Components (Grey Vest)|Wizard', module)
  .addDecorator(GVDecorator)
  .addWithJSX('QueryWizard', story(GVQueryWizard))
  .addWithJSX(
    'Accordion with FilterButtonList',
    story2(GVStepsAccordion, GVFilterButtonList)
  )
