import * as F from 'futil-js'
import React from 'react'
import { Provider } from 'mobx-react'
import { storiesOf } from '@storybook/react'
import { loadHereOptions, geoCodeLocation } from '../../src/utils/geo'
import AsyncSelect from 'react-select/lib/Async'

import TestTree from '../testTree'

let formatYear = x => new Date(x).getUTCFullYear()
import { Flex, SpacedList } from '../../src/layout'
import { ExampleTypes } from '../DemoControls'
let {
  Facet,
  Number,
  Query,
  Text,
  ResultCount,
  ResultTable,
  DateHistogram,
  TagsQuery,
  Geo,
} = ExampleTypes

storiesOf('Search Components (Unthemed)|Example Types', module)
  .addWithJSX('Full Demo', () => (
    <div
      style={{
        backgroundColor: '#333',
        color: '#AAA',
        padding: '20px',
        borderRadius: '10px',
      }}
    >
      <Provider tree={TestTree()}>
        <SpacedList>
          <Query path={['query']} />
          <Flex>
            <div style={{ flex: 1 }}>
              <SpacedList>
                <TagsQuery path={['tagsQuery']} />
                <Text path={['titleText']} />
                <Facet path={['facet']} formatCount={x => `(${x})`} />
                <Facet path={['facet']} display={F.autoLabel} />
                <Number path={['number']} />
                <Number path={['number']} />
                <Geo
                  loadOptions={loadHereOptions}
                  path={['geo']}
                  AutoComplete={AsyncSelect}
                  GeoCodeLocation={geoCodeLocation}
                />
              </SpacedList>
            </div>
            <div style={{ flex: 4 }}>
              <SpacedList>
                <DateHistogram path={['dateHistogram']} format={formatYear} />
                <ResultCount path={['results']} />
                <Flex
                  style={{
                    alignItems: 'baseline',
                    justifyContent: 'center',
                  }}
                >
                  <ResultTable path={['results']} infer />
                </Flex>
              </SpacedList>
            </div>
          </Flex>
        </SpacedList>
      </Provider>
    </div>
  ))
  .addWithJSX('Geo filter & HERE maps', () => (
    <div
      style={{
        backgroundColor: '#333',
        color: '#AAA',
        padding: '20px',
        borderRadius: '10px',
      }}
    >
      <Provider tree={TestTree()}>
        <Flex style={{ flexFlow: 'column wrap' }}>
          <div style={{ flex: 1 }}>
            <Geo
              placeholder="Enter address, city, state, zip or business name ..."
              loadOptions={loadHereOptions}
              path={['geo']}
              AutoComplete={AsyncSelect}
            />
          </div>
        </Flex>
      </Provider>
    </div>
  ))
