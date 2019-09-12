import _ from 'lodash/fp'
import React from 'react'
import { observable } from 'mobx'
import { fromPromise } from 'mobx-utils'
import Contexture, { updateSchemas } from '../utils/contexture'
import { mergeOverAll } from 'futil-js'
import {
  Awaiter,
  schemaFieldProps,
  componentForType,
  SearchLayout,
  SearchFilters,
  SearchTree,
  ToggleFiltersHeader,
} from '../../../src'
import { Tab, TabContent, TabLabel, Tabs } from '../../../src/greyVest'
import {
  DateRangePicker,
  TypeMap,
  TermsStatsTable,
  TagsQuery,
  ResultCount,
  PagedResultTable,
} from '../../../src/exampleTypes'
import { Column } from '../../../src/greyVest/ExpandableTable'
import { ThemeConsumer } from '../../../src/utils/theme'

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
    .then(_.merge(overrides))
    .then(_.tap(() => tree.refresh(['root'])))
)

let mapNodeToProps = mergeOverAll([
  componentForType(TypeMap),
  schemaFieldProps('signicantDigits'),
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

let GreyVestStory = theme => (
  <Awaiter promise={schemas}>
    {schemas => (
      <SearchLayout mode={state.mode}>
        <SearchFilters mode={state.mode} setMode={x => (state.mode = x)}>
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
        </SearchFilters>
        <div>
          <ToggleFiltersHeader
            mode={state.mode}
            setMode={x => (state.mode = x)}
          >
            Search Movies
          </ToggleFiltersHeader>
          <div className="gv-search-bar">
            <theme.Box>
              <TagsQuery tree={tree} path={['root', 'bar']} autoFocus />
            </theme.Box>
            <theme.ButtonGroup>
              <theme.Button
                className="gv-search-button"
                onClick={tree.triggerUpdate}
                primary
              >
                Search
              </theme.Button>
              <div className="gv-search-toolbar">
                <theme.AlternateButton
                  title="Auto Update"
                  primary={state.autoUpdate}
                  onClick={() => {
                    state.autoUpdate = !state.autoUpdate
                    tree.disableAutoUpdate = !state.autoUpdate
                  }}
                >
                  <theme.Icon icon="AutoUpdate" />
                </theme.AlternateButton>
                <theme.AlternateButton
                  onClick={() => {
                    window.location.reload()
                  }}
                  title="New Search"
                >
                  <theme.Icon icon="New" />
                </theme.AlternateButton>
              </div>
            </theme.ButtonGroup>
          </div>
          <h1>Search Results</h1>
          <Tabs defaultValue="results" TabPanel={theme.Box}>
            <TabLabel value="results">
              Movies (
              <ResultCount tree={tree} path={['root', 'results']} />)
            </TabLabel>
            <TabContent value="results">
              <PagedResultTable
                tree={tree}
                path={['root', 'results']}
                fields={_.omit(
                  ['imdbId', 'runtimeMinutes'],
                  schemas[tree.tree.schema].fields
                )}
                criteria={['root', 'criteria']}
                mapNodeToProps={componentForType(TypeMap)}
              />
            </TabContent>
            <Tab value="analytics" label="Analytics">
              <TermsStatsTable
                tree={tree}
                criteria={['root', 'criteria']}
                criteriaField="genres"
                path={['root', 'genreScores']}
                tableAttrs={{ className: 'gv-table' }}
                sizeOptions={[10, 25, 50]}
                getValue="key"
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
)

export default () => <ThemeConsumer>{GreyVestStory}</ThemeConsumer>
