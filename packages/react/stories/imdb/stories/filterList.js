import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { observable, autorun } from 'mobx'
import { fromPromise } from 'mobx-utils'
import { observer, inject } from 'mobx-react'
import Contexture, { updateSchemas } from '../utils/contexture'
import { FilterList, Flex, Awaiter, SpacedList } from '../../../src'
import { DarkBox, Adder, Pager, ExampleTypes } from '../../DemoControls'
let {
  Query,
  ResultCount,
  ResultTable,
  DateHistogram,
  CheckableTermsStatsTable,
  TypeMap,
} = ExampleTypes

import { Column } from './../../../src/layout/ExpandableTable'

let formatYear = x => new Date(x).getUTCFullYear()

let tree = Contexture({
  key: 'searchRoot',
  type: 'group',
  schema: 'movies',
  children: [
    {
      key: 'searchQuery',
      type: 'query',
      field: 'title',
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
    },
    {
      key: 'releases',
      type: 'dateHistogram',
      key_field: 'released',
      value_field: 'imdbVotes',
      interval: '3650d',
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
        pageSize: 50,
      },
    ],
  })

  termTree.mutate(['detailRoot', 'detailFacet'], { values: [term] })
  return termTree
})

let schemas = fromPromise(
  updateSchemas().then(
    _.merge(_, {
      movies: {
        fields: {
          released: { label: 'Release Date' },
        },
      },
    })
  )
)

const Story = inject(() => {
  let state = observable({
    selected: [],
  })
  state.getValue = x => x.key
  autorun(() => console.info(state.selected.slice()))
  return { state }
})(
  observer(({ state }) => (
    <DarkBox>
      <Awaiter promise={schemas}>
        {schemas => (
          <SpacedList>
            <Query tree={tree} path={['searchRoot', 'searchQuery']} />
            <Flex>
              <div style={{ flex: 1 }}>
                <FilterList
                  tree={tree}
                  path={['searchRoot', 'criteria']}
                  fields={schemas.movies.fields}
                  typeComponents={TypeMap}
                />
                <Adder
                  tree={tree}
                  path={['searchRoot', 'criteria']}
                  fields={schemas.movies.fields}
                  uniqueFields
                />
              </div>
              <div style={{ flex: 4, maxWidth: '80%' }}>
                <ResultCount tree={tree} path={['searchRoot', 'results']} />
                <DateHistogram
                  tree={tree}
                  path={['searchRoot', 'releases']}
                  format={formatYear}
                />
                <CheckableTermsStatsTable
                  tree={tree}
                  criteria={['searchRoot', 'criteria']}
                  path={['searchRoot', 'genreScores']}
                  tableAttrs={{ style: { margin: 'auto' } }}
                  Checkbox={props => <input type="checkbox" {...props} />}
                  selected={F.lensProp('selected', state)}
                  getValue={state.getValue}
                >
                  <Column field="key" label="Genre" />
                  <Column field="count" label="Found" enableSort />
                  <Column field="avg" label="Average" enableSort />
                  <Column
                    field="key"
                    label=""
                    expand={{
                      display: x =>
                        `Show top 50 based on meta score for ${x} ▼`,
                    }}
                    collapse={{
                      display: x =>
                        `Hide top 50 based on meta score for ${x} ▲`,
                    }}
                  >
                    {x => (
                      <div>
                        <ResultTable
                          tree={termDetailsTree(x)}
                          path={['detailRoot', 'results']}
                          fields={_.pick(
                            ['title', 'year', 'genres'],
                            schemas.movies.fields
                          )}
                        />
                        <Flex
                          style={{
                            justifyContent: 'space-around',
                            marginTop: 10,
                            marginBottom: 10,
                          }}
                        >
                          <Pager
                            tree={termDetailsTree(x)}
                            path={['detailRoot', 'results']}
                          />
                        </Flex>
                      </div>
                    )}
                  </Column>
                  <Column
                    field="key"
                    label={() => <strong>Custom Header</strong>}
                    expand={{ display: () => 'Expand me ▼' }}
                    collapse={{ display: () => 'Hide me ▲' }}
                  >
                    {x => (
                      <div>
                        I just expand and show my parent value, which is{' '}
                        <strong>{x}</strong>
                      </div>
                    )}
                  </Column>
                </CheckableTermsStatsTable>
                <div style={{ overflowX: 'auto' }}>
                  <ResultTable
                    tree={tree}
                    path={['searchRoot', 'results']}
                    fields={{
                      poster: {
                        display: x => <img src={x} width="180" height="270" />,
                        order: 1,
                      },
                    }}
                    infer
                  />
                </div>
                <Flex style={{ justifyContent: 'space-around' }}>
                  <Pager tree={tree} path={['searchRoot', 'results']} />
                </Flex>
              </div>
            </Flex>
          </SpacedList>
        )}
      </Awaiter>
    </DarkBox>
  ))
)

export default () => <Story />
