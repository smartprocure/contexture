import React from 'react'
import ContextureProvider from '../../../src/ContextureProvider'
import { Flex, Grid, SpacedList } from '../../../src/layout/'
import { types, service } from '../utils/contexture'
import IMDBCards from '../components/IMDBCards'
import { DarkBox, Pager, ExampleTypes } from '../../DemoControls'
let { Facet, Number, Query, ResultCount, DateHistogram } = ExampleTypes

let formatYear = x => new Date(x).getFullYear() + 1

export default () => (
  <ContextureProvider schema="movies" types={types} service={service}>
    <DarkBox>
      <SpacedList>
        <Query field="title" />
        <Grid gap="5px" columns="1fr 4fr">
          <div>
            <SpacedList>
              <div>
                <b>MetaScore</b>
                <Number field="metaScore" min={0} max={100} />
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
          <div>
            <DateHistogram
              key_field="released"
              value_field="imdbVotes"
              interval="3650d"
              format={formatYear}
            />
            <Flex style={{ justifyContent: 'space-around' }}>
              <h3><ResultCount pageSize={6} /></h3>
            </Flex>
            <IMDBCards path={['root', 'results']} />
            <Flex style={{ justifyContent: 'space-around' }}>
              <Pager path={['root', 'results']} />
            </Flex>
          </div>
        </Grid>
      </SpacedList>
    </DarkBox>
  </ContextureProvider>
)
