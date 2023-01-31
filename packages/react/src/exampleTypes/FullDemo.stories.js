import F from 'futil'
import React from 'react'
import AsyncSelect from 'react-select/lib/Async.js'
import { loadOptions, geoCodeLocation } from '../utils/geo.js'
import TestTree from './stories/testTree.js'
import { Flex, SpacedList } from '../../src/greyVest/index.js'
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
} from '../../src/exampleTypes/index.js'

export default {
  title: 'Full Demo',
}

let formatYear = (x) => new Date(x).getUTCFullYear()

export const FullDemo = () => {
  let tree = TestTree()
  return (
    <div
      style={{
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
                formatCount={(x) => `(${x})`}
              />
              <Facet tree={tree} path={['facet']} display={F.autoLabel} />
              <Number tree={tree} path={['number']} />
              <Number tree={tree} path={['number']} />
              <Geo
                tree={tree}
                loadOptions={loadOptions}
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
  )
}
