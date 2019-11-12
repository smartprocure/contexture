import * as F from 'futil'
import React from 'react'
import { storiesOf } from '@storybook/react'
import AsyncSelect from 'react-select/lib/Async'
import { loadHereOptions, geoCodeLocation } from '../utils/geo'
import { ThemeProvider } from '../utils/theme'
import theme from '../stories/DemoControls'

import TestTree from './stories/testTree'

let formatYear = x => new Date(x).getUTCFullYear()
import { Flex, SpacedList } from '../../src/greyVest'
import {
  Facet,
  Number,
  Query,
  Text,
  ResultCount,
  ResultTable,
  DateHistogram,
  TagsQuery,
  Geo,
} from '../../src/exampleTypes'

storiesOf('Components|ExampleTypes', module).addWithJSX('Full Demo', () => {
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
