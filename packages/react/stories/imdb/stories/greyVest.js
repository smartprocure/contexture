import _ from 'lodash/fp'
import React from 'react'
import { observable } from 'mobx'
import { fromPromise } from 'mobx-utils'
import Contexture, { updateSchemas } from '../utils/contexture'
import { Flex, Awaiter } from '../../../src'
import {
  Fonts,
  GVStyle,
  Button,
  ExampleTypes,
  IconButton,
  Tabs,
  Tab,
  TabContent,
  TabOption,
  PagedResultTable,
  Box,
  SearchLayout,
  SearchEditor,
  SearchTree,
  ToggleFiltersButton,
} from '../../../src/themes/greyVest'
import { Column } from './../../../src/layout/ExpandableTable'
let {
  ResultCount,
  TypeMap,
  TagsQuery,
  DateRangePicker,
  TermsStatsTable,
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
      key: 'criteria',
      type: 'group',
      join: 'and',
      children: [
        {
          key: 'status',
          field: 'released',
          type: 'date',
          useDateMath: true,
        },
        {
          key: 'titleGroup',
          type: 'group',
          join: 'or',
          children: [
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
          ],
        },
        {
          key: 'titleText',
          type: 'tagsText',
          field: 'title',
        },
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
          paused: true,
        },
        {
          key: 'searchActors',
          type: 'facet',
          field: 'actors',
        },
        {
          key: 'date',
          type: 'date',
          field: 'released',
          from: '2011-01-01T05:00:00.000Z',
          to: '2018-01-01T05:00:00.000Z',
        },
        {
          key: 'IntentionallyBrokenNode',
          type: 'IntentionallyMissingType',
          field: 'missingField',
        },
        {
          key: 'ExistsAndBoolDemo',
          type: 'group',
          join: 'or',
          children: [
            {
              key: 'missingField',
              type: 'exists',
              field: 'Missing Field',
              value: false,
            },
            {
              // The IMDB index doesn't have a bool type, but that's ok because this is in an OR
              key: 'missingBool',
              type: 'bool',
              field: 'Missing Bool',
              value: false,
            },
          ],
        },
      ],
    },
    {
      key: 'results',
      type: 'results',
      include: [
        'imdbId',
        'runtimeMinutes',
        'poster',
        'title',
        'actors',
        'genres',
        'metaScore',
        'rated',
        'released',
        'plot',
      ],
      sortField: '',
    },
    {
      key: 'genreScores',
      type: 'terms_stats',
      key_field: 'genres',
      value_field: 'metaScore',
      order: 'sum',
      size: 25,
    },
  ],
})
tree.disableAutoUpdate = true

let state = observable({
  autoUpdate: false,
  mode: 'basic',
})

let termDetailsTree = _.memoize(term => {
  let termTree = Contexture({
    key: 'detailRoot',
    type: 'group',
    schema: 'movies',
    children: [
      {
        key: 'detailFacet',
        type: 'facet',
        field: 'genres',
      },
      {
        key: 'results',
        type: 'results',
        sortField: 'metaScore',
        order: 'desc',
        pageSize: 5,
      },
    ],
  })

  termTree.mutate(['detailRoot', 'detailFacet'], { values: [term] })
  return termTree
})

let divs = _.map(x => <div key={x}>{x}</div>)
let overrides = {
  movies: {
    fields: {
      released: { label: 'Release Date' },
      poster: {
        display: x => <img src={x} width="180" height="270" />,
        order: 2,
      },
      title: {
        order: 1,
        display: x => <span dangerouslySetInnerHTML={{ __html: x }} />,
      },
      genres: { display: divs },
      actors: { display: divs },
      imdbId: { path: ['Imdb', 'imdbId'] },
      imdbRating: { path: ['Imdb', 'imdbRating'] },
      imdbVotes: { path: ['Imdb', 'imdbVotes'] },
      year: { defaultNodeProps: { number: { min: 2005 } } },
      metaScore: { significantDigits: 2 },
    },
  },
}
let schemas = fromPromise(
  updateSchemas()
    .then(_.merge(_, overrides))
    .then(_.tap(() => tree.refresh(['root'])))
)

// (f, g) -> (x, y) -> {...f(x, y), ...g(x, y)}
let mergeOverAll = fns =>
  _.flow(
    _.over(fns),
    _.mergeAll
  )

let componentForType = TypeMap => ({ type }) => ({ component: TypeMap[type] })
let schemaProps = props => ({ field }, fields) => _.pick(props, fields[field])

let mapNodeToProps = mergeOverAll([
  componentForType(TypeMap),
  schemaProps('signicantDigits'),
  ({ key }) =>
    key === 'status' && {
      component: DateRangePicker,
      ranges: [
        { label: 'All Time', from: '', to: '' },
        { label: 'This Year', from: 'now/y', to: '' },
        {
          label: 'Last Year',
          from: 'now-1y/y',
          to: 'now/y',
        },
      ],
    },
])

export default () => (
  <div className="gv-body">
    <link
      href="https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.min.css"
      rel="stylesheet"
    />
    <Fonts />
    <GVStyle />
    <Awaiter promise={schemas}>
      {schemas => (
        <SearchLayout mode={state.mode}>
          <SearchEditor mode={state.mode} setMode={x => (state.mode = x)}>
            <SearchTree
              tree={tree}
              path={['root', 'criteria']}
              fields={schemas.movies.fields}
              mapNodeToLabel={({ key }) =>
                ({
                  titleContains: 'Title Contains',
                  titleDoesNotContain: 'Title Does Not Contain',
                }[key])
              }
              mapNodeToProps={mapNodeToProps}
            />
          </SearchEditor>
          <div>
            <h1>Search Movies</h1>
            <div className="gv-search-bar">
              <Box>
                <TagsQuery tree={tree} path={['root', 'bar']} />
              </Box>
              <div className="gv-button-group">
                <Button
                  className="gv-search-button"
                  onClick={tree.triggerUpdate}
                  primary
                >
                  Search
                </Button>
                <div className="gv-search-toolbar">
                  <IconButton
                    onClick={() => {
                      window.location.reload()
                    }}
                    title="New Search"
                  >
                    <i className="material-icons">fiber_new</i>
                  </IconButton>
                  <IconButton
                    title="Auto Update"
                    primary={state.autoUpdate}
                    onClick={() => {
                      state.autoUpdate = !state.autoUpdate
                      tree.disableAutoUpdate = !state.autoUpdate
                    }}
                  >
                    <i className="material-icons">autorenew</i>
                  </IconButton>
                </div>
              </div>
            </div>
            <Flex style={{ alignItems: 'center' }}>
              <h1>Search Results</h1>
              {state.mode === 'resultsOnly' && (
                <ToggleFiltersButton onClick={() => (state.mode = 'basic')} />
              )}
            </Flex>
            <Tabs value="results">
              <TabOption value="results">
                Movies (<ResultCount tree={tree} path={['root', 'results']} />)
              </TabOption>
              <TabContent value="results">
                <PagedResultTable
                  tree={tree}
                  path={['root', 'results']}
                  fields={_.omit(
                    ['imdbId', 'runtimeMinutes'],
                    schemas[tree.tree.schema].fields
                  )}
                  criteria={['root', 'criteria']}
                  typeComponents={TypeMap}
                />
              </TabContent>
              <Tab value="analytics" label="Analytics">
                <TermsStatsTable
                  tree={tree}
                  path={['root', 'genreScores']}
                  tableAttrs={{ className: 'gv-table' }}
                  sizeOptions={[10, 25, 50]}
                >
                  <Column field="key" label="Genre" />
                  <Column field="count" label="Found" />
                  <Column
                    field="key"
                    label=""
                    expand={{ display: x => `Show results for ${x} +` }}
                    collapse={{ display: x => `Hide results for ${x} -` }}
                  >
                    {x => (
                      <div style={{ marginBottom: 25 }}>
                        <PagedResultTable
                          tree={termDetailsTree(x)}
                          path={['detailRoot', 'results']}
                          fields={_.pick(
                            ['title', 'year', 'genres'],
                            schemas.movies.fields
                          )}
                        />
                      </div>
                    )}
                  </Column>
                </TermsStatsTable>
              </Tab>
            </Tabs>
          </div>
        </SearchLayout>
      )}
    </Awaiter>
  </div>
)
