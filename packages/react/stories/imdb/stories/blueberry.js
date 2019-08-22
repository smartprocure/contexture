import _ from 'lodash/fp'
import React from 'react'
import { observable } from 'mobx'
import { fromPromise } from 'mobx-utils'
import Contexture, { updateSchemas } from '../utils/contexture'
import { ThemeProvider } from '../../../src/utils/theme'
import {
  FilterList,
  Label,
  Flex,
  Awaiter,
  SpacedList,
  Grid,
  componentForType,
} from '../../../src'
import Adder from '../../../src/FilterAdder'
import {
  Fonts,
  Style,
  Button,
  Checkbox,
  ButtonRadio,
} from '../../../src/blueberry'
import theme from '../../../src/themes/blueberry'
import ExampleTypes, { TypeMap } from '../../../src/exampleTypes'
let { ResultCount, PagedResultTable, TagsQuery, DateRangePicker } = ExampleTypes

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
      include: [
        'poster',
        'title',
        'actors',
        'genres',
        'metaScore',
        'rated',
        'released',
        'plot',
      ],
    },
  ],
})
tree.disableAutoUpdate = true

let state = observable({
  autoUpdate: false,
})

let divs = _.map(x => <div key={x}>{x}</div>)
let schemas = fromPromise(
  updateSchemas()
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
            imdbId: { path: ['Imdb', 'imdbId'] },
            imdbRating: { path: ['Imdb', 'imdbRating'] },
            imdbVotes: { path: ['Imdb', 'imdbVotes'] },
          },
        },
      })
    )
    .then(_.tap(() => tree.refresh(['root'])))
)

export default () => (
  <ThemeProvider theme={theme}>
    <div className="bb-body">
      <Fonts />
      <Style />
      <Awaiter promise={schemas}>
        {schemas => (
          <Grid gap="22px" columns="1fr 4fr" style={{ margin: '0 22px' }}>
            <div>
              <h1>Filters</h1>
              <SpacedList>
                <div>
                  <Label>Released</Label>
                  <DateRangePicker
                    tree={tree}
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
                  <TagsQuery tree={tree} path={['root', 'titleContains']} />
                  Does Not Contain
                  <TagsQuery
                    tree={tree}
                    path={['root', 'titleDoesNotContain']}
                  />
                </div>
                <FilterList
                  tree={tree}
                  path={['root', 'criteria']}
                  fields={schemas.movies.fields}
                  mapNodeToProps={componentForType(TypeMap)}
                />
                <Adder
                  tree={tree}
                  path={['root', 'criteria']}
                  fields={schemas.movies.fields}
                  uniqueFields
                />
              </SpacedList>
            </div>
            <div>
              <Grid columns="1fr 25px 150px" style={{ alignItems: 'center' }}>
                <TagsQuery tree={tree} path={['root', 'bar']} />
                <Checkbox
                  checked={state.autoUpdate}
                  onChange={val => {
                    tree.disableAutoUpdate = !val
                    state.autoUpdate = !!val
                  }}
                />
                {!state.autoUpdate && (
                  <Button onClick={tree.triggerUpdate} primary>
                    Search
                  </Button>
                )}
              </Grid>
              <Flex
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h1>
                  Results (
                  <ResultCount tree={tree} path={['root', 'results']} />)
                </h1>
                <Flex>
                  <ButtonRadio
                    options={[
                      { label: 'AutoSearch On', value: true },
                      { label: 'AutoSearch Off', value: false },
                    ]}
                    value={state.autoUpdate}
                    onChange={val => {
                      tree.disableAutoUpdate = !val
                      state.autoUpdate = !!val
                    }}
                  />
                </Flex>
              </Flex>
              <div className="bb-box">
                <PagedResultTable
                  tree={tree}
                  path={['root', 'results']}
                  fields={schemas[tree.tree.schema].fields}
                  criteria={['root', 'criteria']}
                  mapNodeToProps={componentForType(TypeMap)}
                />
              </div>
            </div>
          </Grid>
        )}
      </Awaiter>
    </div>
  </ThemeProvider>
)
