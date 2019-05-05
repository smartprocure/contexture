import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { observable } from 'mobx'
import { fromPromise } from 'mobx-utils'
import { Provider } from 'mobx-react'
import Contexture, { updateSchemas } from '../utils/contexture'
import { Label, Flex, Awaiter } from '../../../src'
import {
  FilterList,
  Fonts,
  GVStyle,
  Adder,
  Button,
  Pager,
  ExampleTypes,
  IconButton,
  Tabs,
  QueryBuilder,
  PagedResultTable
} from '../../../src/themes/greyVest'
import { Column } from './../../../src/layout/ExpandableTable'
let {
  ResultCount,
  ResultTable,
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
      key: 'status',
      field: 'released',
      type: 'date',
      useDateMath: true,
    },
    {
      key: 'criteria',
      type: 'group',
      join: 'and',
      children: [
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
  showBuilder: false,
  tab: 'results',
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
            title: {
              order: 1,
              display: x => <span dangerouslySetInnerHTML={{ __html: x }} />,
            },
            genres: { display: divs },
            actors: { display: divs },
            imdbId: { path: ['Imdb', 'imdbId'] },
            imdbRating: { path: ['Imdb', 'imdbRating'] },
            imdbVotes: { path: ['Imdb', 'imdbVotes'] },
            year: {
              defaultNodeProps: { number: { min: 2005 } },
            },
            metaScore: { significantDigits: 2 },
          },
        },
      })
    )
    .then(_.tap(() => tree.refresh(['root'])))
)

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
        <Provider treee={tree}>
          <div
            className="gv-grid"
            style={state.showBuilder ? { gridTemplateColumns: '1fr' } : {}}
          >
            {state.showBuilder || (
              <div>
                <Flex style={{ alignItems: 'center' }}>
                  <h1>Filters</h1>
                  <IconButton
                    title="Open Builder"
                    onClick={F.flip('showBuilder', state)}
                  >
                    <i className="material-icons">build</i>
                  </IconButton>
                </Flex>
                <div className="gv-box filter-list">
                  <div className="filter-list-item">
                    <Label>Released</Label>
                    <div className="filter-list-item-contents">
                      <DateRangePicker
                        tree={tree}
                        path={['root', 'status']}
                        ranges={[
                          { label: 'All Time', from: '', to: '' },
                          { label: 'This Year', from: 'now/y', to: '' },
                          {
                            label: 'Last Year',
                            from: 'now-1y/y',
                            to: 'now/y',
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <FilterList
                    tree={tree}
                    path={['root', 'criteria']}
                    fields={schemas.movies.fields}
                    typeComponents={TypeMap}
                    mapNodeToLabel={({ key }) =>
                      ({
                        titleContains: 'Title Contains',
                        titleDoesNotContain: 'Title Does Not Contain',
                      }[key])
                    }
                    mapNodeToProps={(
                      { field },
                      { metaScore: { significantDigits } }
                    ) => (field === 'metaScore' ? { significantDigits } : {})}
                  />
                  <Adder
                    tree={tree}
                    path={['root', 'criteria']}
                    fields={schemas.movies.fields}
                    uniqueFields
                  />
                </div>
              </div>
            )}
            <div>
              <h1>Search Movies</h1>
              <div className="gv-search-bar">
                <div className="gv-box">
                  <TagsQuery
                  tree={tree}
                    path={['root', 'bar']}
                    placeholder="Enter search here..."
                  />
                </div>
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
              {state.showBuilder && (
                <div>
                  <Flex style={{ alignItems: 'center' }}>
                    <h1>Builder</h1>
                    <IconButton
                      title="Open Builder"
                      onClick={F.flip('showBuilder', state)}
                    >
                      <i className="material-icons">build</i>
                    </IconButton>
                  </Flex>
                  <QueryBuilder
                    tree={tree}
                    typeComponents={TypeMap}
                    fields={schemas.movies.fields}
                    path={['root', 'criteria']}

                    mapNodeToProps={(
                      { field },
                      { metaScore: { significantDigits } }
                    ) => (field === 'metaScore' ? { significantDigits } : {})}
                  />
                </div>
              )}
              <h1>Search Results</h1>
              <Tabs
                options={[
                  {
                    value: 'results',
                    label: (
                      <span>
                        Movies (<ResultCount tree={tree} path={['root', 'results']} />)
                      </span>
                    ),
                  },
                  {
                    value: 'analytics',
                    label: 'Analytics',
                  },
                ]}
                value={state.tab}
                onChange={x => {
                  state.tab = x
                }}
              />
              {state.tab === 'results' && (
                <div className="gv-box">
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
                </div>
              )}
              {state.tab === 'analytics' && (
                <div className="gv-box">
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
                        <Provider tree={termDetailsTree(x)}>
                          <div>
                            <ResultTable
                              path={['detailRoot', 'results']}
                              fields={_.pick(
                                ['title', 'year', 'genres'],
                                schemas.movies.fields
                              )}
                            />
                            <Flex
                              style={{
                                justifyContent: 'space-around',
                                top: -50,
                                position: 'relative',
                              }}
                            >
                              <Pager path={['detailRoot', 'results']} />
                            </Flex>
                          </div>
                        </Provider>
                      )}
                    </Column>
                  </TermsStatsTable>
                </div>
              )}
            </div>
          </div>
        </Provider>
      )}
    </Awaiter>
  </div>
)
