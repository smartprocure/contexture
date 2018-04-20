import _ from 'lodash/fp'
import React from 'react'
import { fromPromise } from 'mobx-utils'
import { Provider } from 'mobx-react'
import Contexture, { esClient } from '../utils/contexture'
import { getESSchemas } from '../../../src/utils/schema'
import { partial } from '../../../src/utils/mobx-react-utils'
import {
  Flex,
  Awaiter,
  Modal,
  SpacedList,
  ModalPicker,
  FilteredPicker,
} from '../../../src/layout/'
import { FilterList } from '../../../src/FilterList'
import FilterAdder from '../../../src/FilterAdder'
import {
  Button,
  Input,
  Highlight,
  ListGroupItem,
  PagerItem,
  PagerList,
} from '../../DemoControls'
import ExampleTypes from '../../../src/exampleTypes/'
let {
  Query,
  ResultCount,
  ResultTable,
  ResultPager,
  DateHistogram,
  TypeMap,
} = ExampleTypes({Input})

// Pre apply some props
let Adder = partial(
  {
    Picker: partial(
      {
        Modal,
        Button,
        label: '+ Include Additional Filter',
        Picker: partial(
          { Input, Highlight, Item: ListGroupItem },
          FilteredPicker
        ),
      },
      ModalPicker
    ),
  },
  FilterAdder
)

let Pager = partial(
  {
    Item: PagerItem,
    List: PagerList,
  },
  ResultPager
)

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
      pageSize: 6,
    },
    {
      key: 'releases',
      type: 'dateHistogram',
      key_field: 'released',
      value_field: 'imdbVotes',
      interval: '3650d',
    },
  ],
})

let schemas = fromPromise(
  getESSchemas(esClient).then(
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
            <div style={{ flex: 4 }}>
              <ResultCount path={['searchRoot', 'results']} />
              <DateHistogram
                path={['searchRoot', 'releases']}
                format={formatYear}
              />
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
              <Pager path={['searchRoot', 'results']} />
            </div>
          </Flex>
        </SpacedList>
      </Provider>
    )}
  </Awaiter>
)
