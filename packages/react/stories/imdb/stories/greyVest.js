import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { observable } from 'mobx'
import { fromPromise } from 'mobx-utils'
import { Provider } from 'mobx-react'
import Contexture, { updateSchemas } from '../utils/contexture'
import { Label, Flex, Awaiter } from '../../../src'
import {
  Input,
  Textarea,
  Select,
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
      sortField: '',
    },
    {
      key: 'genreScores',
      type: 'terms_stats',
      key_field: 'genres',
      value_field: 'metaScore',
      order: 'sum',
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
let input
let select
let textArea

export default () => (
  <div className="gv-body">
    <Fonts />
    <GVStyle />
    <Input ref={e => (input = e)} />
    <Textarea ref={e => (textArea = e)} />
    <Select ref={e => (select = e)} />
    <Button onClick={() => input.focus()}>Focus Input</Button>
    <Button onClick={() => textArea.focus()}>Focus Text Area</Button>
    <Button onClick={() => select.focus()}>Focus Select</Button>
    <Awaiter promise={schemas}>
      {schemas => (
        <Provider tree={tree}>
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
                        path={['root', 'status']}
                        ranges={[
                          { label: 'All Time', from: '', to: '' },
                          { label: 'This Year', from: 'now/y', to: '' },
                          { label: 'Last Year', from: 'now-1y/y', to: 'now/y' },
                        ]}
                      />
                    </div>
                  </div>
                  <FilterList
                    path={['root', 'criteria']}
                    fields={schemas.movies.fields}
                    typeComponents={TypeMap}
                    mapNodeToLabel={({ key }) =>
                      ({
                        titleContains: 'Title Contains',
                        titleDoesNotContain: 'Title Does Not Contain',
                      }[key])
                    }
                  />
                  <Adder
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
                    types={TypeMap}
                    fields={schemas.movies.fields}
                    path={['root', 'criteria']}
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
                        Movies (<ResultCount path={['root', 'results']} />)
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
                  <ResultTable
                    path={['root', 'results']}
                    fields={schemas[tree.tree.schema].fields}
                    criteria={['root', 'criteria']}
                    typeComponents={TypeMap}
                  />
                  <Flex
                    style={{ justifyContent: 'space-around', padding: '10px' }}
                  >
                    <Pager path={['root', 'results']} />
                  </Flex>
                </div>
              )}
              {state.tab === 'analytics' && (
                <div className="gv-box">
                  <TermsStatsTable
                    path={['root', 'genreScores']}
                    tableAttrs={{ className: 'gv-table' }}
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
