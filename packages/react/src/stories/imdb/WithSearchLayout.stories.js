import _ from 'lodash/fp.js'
import F from 'futil'
import React from 'react'
import { observable } from '../../utils/mobx.js'
import { fromPromise } from 'mobx-utils'
import Contexture, { updateSchemas } from './utils/contexture.js'
import {
  Awaiter,
  schemaFieldProps,
  componentForType,
  SearchLayout,
  SearchFilters,
  SearchTree,
  ToggleFiltersHeader,
  ButtonGroup,
  Icon,
  Box,
} from '../../index.js'
import { useTheme } from '../../utils/theme.js'
import { Grid, Tab, TabContent, TabLabel, Tabs } from '../../greyVest/index.js'
import {
  DateRangePicker,
  TypeMap,
  TermsStatsTable,
  TagsQuerySearchBar,
  ResultCount,
  ResultTable,
} from '../../exampleTypes/index.js'
import { Column } from '../../greyVest/ExpandableTable.js'
import { aspectWrapper } from '../../utils/futil.js'

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
  mode: 'basic',
})

let termDetailsTree = _.memoize((term) => {
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

let divs = _.map((x) => <div key={x}>{x}</div>)
let overrides = {
  movies: {
    fields: {
      released: { label: 'Release Date' },
      poster: {
        display: (x) => <img src={x} width="180" height="270" />,
        order: 2,
      },
      title: {
        order: 1,
        display: (x) => <span dangerouslySetInnerHTML={{ __html: x }} />,
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

let mapNodeToProps = F.mergeOverAll([
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

export default {
  title: 'With Search Layout',
}

export const WithSearchLayout = () => {
  const { AlternateButton } = useTheme()
  return (
    <Awaiter promise={schemas}>
      {(schemas) => (
        <SearchLayout mode={state.mode}>
          <SearchFilters mode={state.mode} setMode={(x) => (state.mode = x)}>
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
              setMode={(x) => (state.mode = x)}
            >
              Search Movies
            </ToggleFiltersHeader>
            <Grid columns="1fr auto" gap={10} placeItems="center stretch">
              <TagsQuerySearchBar
                tree={tree}
                path={['root', 'bar']}
                resultsPath={['root', 'results']}
                autoFocus
                actionWrapper={aspectWrapper}
                searchButtonProps={{ ['data-attribute']: 'attribute1' }}
              />
              <ButtonGroup>
                <AlternateButton
                  title="Auto Update"
                  primary={!tree.disableAutoUpdate}
                  onClick={F.flip('disableAutoUpdate', tree)}
                >
                  <Icon icon="AutoUpdate" />
                </AlternateButton>
                <AlternateButton
                  onClick={() => {
                    window.location.reload()
                  }}
                  title="New Search"
                >
                  <Icon icon="New" />
                </AlternateButton>
              </ButtonGroup>
            </Grid>
            <h1>Search Results</h1>
            <Tabs defaultValue="results" TabPanel={Box}>
              <TabLabel value="results">
                Movies (
                <ResultCount tree={tree} path={['root', 'results']} />)
              </TabLabel>
              <TabContent value="results">
                <ResultTable
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
                    expand={{ display: (x) => `Show results for ${x} +` }}
                    collapse={{ display: (x) => `Hide results for ${x} -` }}
                  >
                    {(x) => (
                      <div style={{ marginBottom: 25 }}>
                        <ResultTable
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
}
