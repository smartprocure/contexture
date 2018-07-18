import _ from 'lodash/fp'
import React from 'react'
import { fromPromise } from 'mobx-utils'
import { Provider } from 'mobx-react'
import Contexture, { updateSchemas } from '../utils/contexture'
import { FilterList, Flex, Awaiter, SpacedList } from '../../../src'
import { DarkBox, Adder, Pager, ExampleTypes } from '../../DemoControls'
let {
  Query,
  ResultCount,
  ResultTable,
  DateHistogram,
  TermsStats,
  TypeMap,
} = ExampleTypes

let formatYear = x => new Date(x).getFullYear() + 1

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

export default () => (
  <DarkBox>
    <Awaiter promise={schemas}>
      {schemas => (
        <Provider tree={tree}>
          <SpacedList>
            <Query path={['searchRoot', 'searchQuery']} />
            <Flex>
              <div style={{ flex: 1 }}>
                <FilterList
                  path={['searchRoot', 'criteria']}
                  fields={schemas.movies.fields}
                  typeComponents={TypeMap}
                />
                <Adder
                  path={['searchRoot', 'criteria']}
                  fields={schemas.movies.fields}
                  uniqueFields
                />
              </div>
              <div style={{ flex: 4, maxWidth: '80%' }}>
                <ResultCount path={['searchRoot', 'results']} />
                <DateHistogram
                  path={['searchRoot', 'releases']}
                  format={formatYear}
                />
                <TermsStats path={['searchRoot', 'genreScores']} />
                <div style={{ overflowX: 'auto' }}>
                  <ResultTable
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
                  <Pager path={['searchRoot', 'results']} />
                </Flex>
              </div>
            </Flex>
          </SpacedList>
        </Provider>
      )}
    </Awaiter>
  </DarkBox>
)
