import _ from 'lodash/fp'
import React from 'react'
import { observable } from 'mobx'
import { fromPromise } from 'mobx-utils'
import Contexture, { updateSchemas } from '../utils/contexture'
import { FilterList, Label, Flex, Grid, componentForType } from '../../../src'
import theme, { TypeMap } from '../../../src/themes/blueberry'
import { ThemeProvider, withTheme } from '../../../src/utils/theme'

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

let BlueberryStory = withTheme()(({ theme }) => (
  <div className="bb-body">
    <theme.Fonts />
    <theme.Style />
    <theme.Awaiter promise={schemas}>
      {schemas => (
        <Grid gap="22px" columns="1fr 4fr" style={{ margin: '0 22px' }}>
          <div>
            <h1>Filters</h1>
            <theme.SpacedList>
              <div>
                <Label>Released</Label>
                <theme.DateRangePicker
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
                <theme.TagsQuery tree={tree} path={['root', 'titleContains']} />
                Does Not Contain
                <theme.TagsQuery
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
              <theme.Adder
                tree={tree}
                path={['root', 'criteria']}
                fields={schemas.movies.fields}
                uniqueFields
              />
            </theme.SpacedList>
          </div>
          <div>
            <Grid columns="1fr 25px 150px" style={{ alignItems: 'center' }}>
              <theme.TagsQuery tree={tree} path={['root', 'bar']} />
              <theme.Checkbox
                checked={state.autoUpdate}
                onChange={val => {
                  tree.disableAutoUpdate = !val
                  state.autoUpdate = !!val
                }}
              />
              {!state.autoUpdate && (
                <theme.Button onClick={tree.triggerUpdate} primary>
                  Search
                </theme.Button>
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
                <theme.ResultCount tree={tree} path={['root', 'results']} />)
              </h1>
              <Flex>
                <theme.RadioList
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
              <theme.ResultTable
                tree={tree}
                path={['root', 'results']}
                fields={schemas[tree.tree.schema].fields}
                criteria={['root', 'criteria']}
                mapNodeToProps={componentForType(TypeMap)}
              />
              <Flex style={{ justifyContent: 'space-around', padding: '10px' }}>
                <theme.Pager tree={tree} path={['root', 'results']} />
              </Flex>
            </div>
          </div>
        </Grid>
      )}
    </theme.Awaiter>
  </div>
))

export default () => (
  <ThemeProvider value={theme}>
    <BlueberryStory />
  </ThemeProvider>
)
