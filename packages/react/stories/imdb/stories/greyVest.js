import _ from 'lodash/fp'
import React from 'react'
import { observable } from 'mobx'
import { fromPromise } from 'mobx-utils'
import { Provider } from 'mobx-react'
import Contexture, { updateSchemas } from '../utils/contexture'
import {
  Label,
  Flex,
  Awaiter,
  SpacedList,
  Grid,
} from '../../../src'
import {
  FilterList,
  Fonts,
  GVStyle,
  Adder,
  Button,
  Pager,
  ExampleTypes,
  Checkbox,
  ButtonRadio,
  IconButton,
  Tabs
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
      sortField: ''
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
  tab: 'results'
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
          },
        },
      })
    )
    .then(_.tap(() => tree.refresh(['root'])))
)

export default () => (
  <div className="gv-body">
    <Fonts />
    <GVStyle />
    <Awaiter promise={schemas}>
      {schemas => (
        <Provider tree={tree}>
          <Grid gap="40px" columns="1fr 4fr" style={{ margin: '0 40px' }}>
            <div>
              <h1>Filters</h1>
              <div className='gv-box filter-list'>
                <div className='filter-list-item'>
                  <Label>Released</Label>
                  <div className='filter-list-item-contents'>
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
                <div className='filter-list-item'>
                  <Label>Title</Label>
                  <div className='filter-list-item-contents'>
                    Contains
                    <TagsQuery path={['root', 'titleContains']} />
                    Does Not Contain
                    <TagsQuery path={['root', 'titleDoesNotContain']} />
                  </div>
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
              </div>
            </div>
            <div>
              <h1>Search Movies</h1>
              <div className="gv-search-bar">
                <div className="gv-box">
                  <TagsQuery path={['root', 'bar']} />
                </div>
                <Flex className="gv-button-group">
                  <Button className="gv-search-button" onClick={tree.triggerUpdate} primary>
                      Search
                  </Button>
                  <Flex className='gv-box' style={{ padding: '15px 30px', alignItems:'center'}}>
                    <IconButton
                      onClick={() => { window.location.reload() }}
                      title="New Search"
                      style={{ marginRight: '20px' }}
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
                  </Flex>
                </Flex>
              </div>
              <h1>Search Results</h1>
              <Tabs
                options={[
                  {
                    value: 'results',
                    label: <span>Movies (<ResultCount path={['root', 'results']} />)</span>
                  },
                  {
                    value: 'analytics',
                    label: 'Analytics'
                  }
                ]}
                value={state.tab}
                onChange={x => {state.tab = x}}
              />
              {state.tab == 'results' && <div className="gv-box">
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
              }
              {state.tab == 'analytics' && <div className='gv-box'>
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
                              top:-50,
                              position: 'relative'
                            }}
                          >
                            <Pager path={['detailRoot', 'results']} />
                          </Flex>
                        </div>
                      </Provider>
                    )}
                  </Column>
                </TermsStatsTable>
              </div>}
            </div>
          </Grid>
        </Provider>
      )}
    </Awaiter>
  </div>
)
