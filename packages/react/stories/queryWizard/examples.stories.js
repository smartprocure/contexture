import _ from 'lodash/fp'
import React from 'react'
import { storiesOf } from '@storybook/react'
import {
  QueryWizard as GVQueryWizard,
  FilterButtonList as GVFilterButtonList,
  AccordionWizard as GVAccordionWizard,
} from '../../src/themes/greyVest'
import DefaultQueryWizard from '../../src/queryWizard/QueryWizard'
import DefaultAccordionWizard from '../../src/queryWizard/AccordionWizard'
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

let story2 = (AccordionWizard, FilterButtonList) => () => (
  <AccordionWizard>
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
  </AccordionWizard>
)

storiesOf('Search Components (Unthemed)|Wizard', module)
  .addWithJSX('QueryWizard', story(DefaultQueryWizard))
  .addWithJSX(
    'Accordion with FilterButtonList',
    story2(DefaultAccordionWizard, DefaultFilterButtonList)
  )

storiesOf('Search Components (Grey Vest)|Wizard', module)
  .addDecorator(GVDecorator)
  .addWithJSX('QueryWizard', story(GVQueryWizard))
  .addWithJSX(
    'Accordion with FilterButtonList',
    story2(GVAccordionWizard, GVFilterButtonList)
  )
