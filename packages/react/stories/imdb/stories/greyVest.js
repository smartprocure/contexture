import _ from 'lodash/fp'
import React from 'react'
import { observable } from 'mobx'
import { fromPromise } from 'mobx-utils'
import { Provider } from 'mobx-react'
import Contexture, { esClient } from '../utils/contexture'
import { getESSchemas } from '../../../src/utils/schema'
import { Flex, Awaiter, SpacedList, Grid } from '../../../src/layout/'
import { FilterList, Label } from '../../../src/FilterList'

import {
  GVStyle,
  Adder,
  Button,
  Pager,
  ExampleTypes
} from '../../../src/themes/greyVest'
let {
  ResultCount,
  ResultTable,
  TypeMap,
  TagsQuery,
  DateRangePicker,
} = ExampleTypes

let tree = Contexture({
  key: 'root',
  type: 'group',
  schema: 'movies',
  children: [
    {
      key: 'bar',
      type: 'tagsQuery',
      field: 'title',
    },
    {
      key: 'status',
      field: 'released',
      type: 'date',
      useDateMath: true,
    },
    
    {
      key: 'titleContains',
      type: 'tagsQuery',
      field: 'title',
    },
    {
      key: 'titleDoesNotContain',
      type: 'tagsQuery',
      field: 'title',
      join: 'none',
    },
    {
      key: 'criteria',
      type: 'group',
      children: [
        {
          key: 'searchNumber',
          type: 'number',
          field: 'metaScore',
          min: 0,
          max: 100,
        },
        {
          key: 'searchFacet',
          type: 'facet',
          field: 'genres',
        },
        {
          key: 'searchActors',
          type: 'facet',
          field: 'actors',
        },
      ],
    },
    {
      key: 'results',
      type: 'results',
      include: ['poster', 'title', 'actors', 'genres', 'metaScore', 'rated', 'released', 'plot'],
    },
  ],
})
tree.disableAutoUpdate = true

let state = observable({
  autoUpdate: false,
})

let divs = _.map(x => <div key={x}>{x}</div>)
let schemas = fromPromise(
  getESSchemas(esClient)
    .then(
      _.merge(_, {
        movies: {
          fields: {
            released: { label: 'Release Date' },
            poster: {
              display: x => <img src={x} width="180" height="270" />,
              order: 2,
            },
            title: { order: 1 },
            genres: { display: divs },
            actors: { display: divs },
          },
        },
      })
    )
    .then(_.tap(() => tree.refresh(['root'])))
)

export default () => (
  <div className="gv-body">
    <link
      href="https://fonts.googleapis.com/css?family=Lato"
      rel="stylesheet"
    />
    <GVStyle />
    <Awaiter promise={schemas}>
      {schemas => (
        <Provider tree={tree}>
          <div style={{ background: '#f4f4f4' }}>
            <Grid gap="22px" columns="1fr 4fr" style={{margin: '0 22px'}}>
              <div>
                <h1>Filters</h1>
                <SpacedList>
                  <div>
                    <Label>Released</Label>
                    <DateRangePicker
                      path={['root', 'status']}
                      ranges={[
                        { label: 'All Time', from: '', to: '' },
                        { label: 'This Year', from: 'now/y', to: '' },
                        { label: 'Last Year', from: 'now-1y/y', to: 'now/y' },
                      ]}
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    Contains
                    <TagsQuery path={['root', 'titleContains']} />
                    Does Not Contain
                    <TagsQuery path={['root', 'titleDoesNotContain']} />
                  </div>
                  <FilterList
                    path={['root', 'criteria']}
                    fields={schemas.movies.fields}
                    typeComponents={TypeMap}
                  />
                  <Adder
                    path={['root', 'criteria']}
                    fields={schemas.movies.fields}
                    uniqueFields
                  />
                </SpacedList>
              </div>
              <div>
                <Grid columns="1fr 25px 150px">
                  <TagsQuery path={['root', 'bar']} />
                  <input
                    type="checkbox"
                    checked={state.autoUpdate}
                    onChange={e => {
                      let val = !!e.target.checked
                      tree.disableAutoUpdate = !val
                      state.autoUpdate = val
                    }}
                  />
                  {!state.autoUpdate && (
                    <Button onClick={tree.triggerUpdate} primary>Search</Button>
                  )}
                </Grid>
                
                <h1>
                  <Flex>
                    {/* Wrapping in Flex makes ResultCount not break lines when updaing */}
                    Results (<ResultCount path={['root', 'results']} />)
                  </Flex>
                </h1>
                  
                <div className="gv-box">
                  <ResultTable
                    path={['root', 'results']}
                    fields={schemas[tree.tree.schema].fields}
                  />
                  <Flex style={{ justifyContent: 'space-around' }}>
                    <Pager path={['root', 'results']} />
                  </Flex>
                </div>
              </div>
            </Grid>
          </div>
        </Provider>
      )}
    </Awaiter>
  </div>
)
