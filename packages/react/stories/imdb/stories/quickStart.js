import React from 'react'
import ContextureProvider from '../../../src/ContextureProvider'
import { Flex, SpacedList } from '../../../src/layout/'
import ExampleTypes from '../../../src/exampleTypes/'
import { types, service } from '../utils/contexture'
import IMDBCards from '../components/IMDBCards'
import { Input } from '../../DemoControls'
let {
  Facet,
  Number,
  Query,
  ResultCount,
  ResultPager,
  DateHistogram,
} = ExampleTypes({ Input })

let formatYear = x => new Date(x).getFullYear() + 1

export default () => (
  <ContextureProvider schema="movies" types={types} service={service}>
    <SpacedList>
      <Query field="title" />
      <Flex>
        <div style={{ flex: 1 }}>
          <SpacedList>
            <div>
              <b>MetaScore</b>
              <Number nodeKey="num" field="metaScore" min={0} max={100} />
            </div>
            <div>
              <b>Genre</b>
              <Facet field="genres" />
            </div>
            <div>
              <b>Actors</b>
              <Facet field="actors" />
            </div>
          </SpacedList>
        </div>
        <div style={{ flex: 4 }}>
          <ResultCount pageSize={6} nodeKey="results" />
          <DateHistogram
            key_field="released"
            value_field="imdbVotes"
            interval="3650d"
            format={formatYear}
          />
          <IMDBCards path={['root', 'results']} />
          <ResultPager path={['root', 'results']} />
        </div>
      </Flex>
    </SpacedList>
  </ContextureProvider>
)
