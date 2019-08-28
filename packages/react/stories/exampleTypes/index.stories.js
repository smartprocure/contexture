import * as F from 'futil-js'
import React from 'react'
import { storiesOf } from '@storybook/react'
import { loadHereOptions, geoCodeLocation } from '../../src/utils/geo'
import AsyncSelect from 'react-select/lib/Async'
import { ThemeProvider } from '../../src/utils/theme'
import theme from '../DemoControls'

import TestTree from '../testTree'

let formatYear = x => new Date(x).getUTCFullYear()
import { Flex, SpacedList } from '../../src/greyVest'
import ExampleTypes from '../../src/exampleTypes'
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
  .addWithJSX('Full Demo', () => {
    let tree = TestTree()
    return (
      <ThemeProvider theme={theme}>
        <div
          style={{
            backgroundColor: '#333',
            color: '#AAA',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <SpacedList>
            <Query tree={tree} path={['query']} />
            <Flex>
              <div style={{ flex: 1 }}>
                <SpacedList>
                  <TagsQuery tree={tree} path={['tagsQuery']} />
                  <Text tree={tree} path={['titleText']} />
                  <Facet
                    tree={tree}
                    path={['facet']}
                    formatCount={x => `(${x})`}
                  />
                  <Facet tree={tree} path={['facet']} display={F.autoLabel} />
                  <Number tree={tree} path={['number']} />
                  <Number tree={tree} path={['number']} />
                  <Geo
                    tree={tree}
                    loadOptions={loadHereOptions}
                    path={['geo']}
                    AutoComplete={AsyncSelect}
                    GeoCodeLocation={geoCodeLocation}
                  />
                </SpacedList>
              </div>
              <div style={{ flex: 4 }}>
                <SpacedList>
                  <DateHistogram
                    tree={tree}
                    path={['dateHistogram']}
                    format={formatYear}
                  />
                  <ResultCount tree={tree} path={['results']} />
                  <Flex
                    style={{
                      alignItems: 'baseline',
                      justifyContent: 'center',
                    }}
                  >
                    <ResultTable tree={tree} path={['results']} infer />
                  </Flex>
                </SpacedList>
              </div>
            </Flex>
          </SpacedList>
        </div>
      </ThemeProvider>
    )
  })
  .addWithJSX('Geo filter & HERE maps', () => (
    <div
      style={{
        backgroundColor: '#333',
        color: '#AAA',
        padding: '20px',
        borderRadius: '10px',
      }}
    >
      <Flex style={{ flexFlow: 'column wrap' }}>
        <div style={{ flex: 1 }}>
          <Geo
            tree={TestTree()}
            placeholder="Enter address, city, state, zip or business name ..."
            loadOptions={loadHereOptions}
            path={['geo']}
            AutoComplete={AsyncSelect}
          />
        </div>
      </Flex>
    </div>
  ))
