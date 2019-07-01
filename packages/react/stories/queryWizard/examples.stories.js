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

// let Node = (type, key) => ({ key, type })

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
                fieldDescription: 'Search for stuff'
              }
            ]
          }
        ],
      })}
      path={['root']}
      mapNodeToProps={componentForType(TypeMap)}
      // fields={fieldsFromSchema(schemas, search)} // schemas[search.tree.schema].fields
    />
  ))
