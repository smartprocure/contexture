import _ from 'lodash/fp'
import React from 'react'
import { fromPromise } from 'mobx-utils'
import { QueryBuilder, Awaiter } from '../../../src'
import Contexture, { updateSchemas } from '../utils/contexture'
import { ExampleTypes } from '../../DemoControls'
let { ResultCount, ResultTable, TypeMap } = ExampleTypes

let tree = Contexture({
  key: 'root',
  type: 'group',
  join: 'and',
  schema: 'movies',
  children: [
    {
      key: 'searchRoot',
      type: 'group',
      join: 'and',
      children: [
        {
          key: 'searchQuery',
          type: 'query',
          field: 'title',
        },
        {
          key: 'searchFacet',
          type: 'facet',
          field: 'genres',
        },
      ],
    },
    {
      key: 'results',
      type: 'results',
      pageSize: 10,
      page: 1,
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
  <Awaiter promise={schemas}>
    {schemas => (
      <div>
        <QueryBuilder
          tree={tree}
          types={TypeMap}
          fields={schemas.movies.fields}
          path={['root', 'searchRoot']}
        />
        <h1>
          <ResultCount tree={tree} path={['root', 'results']} />
        </h1>
        <ResultTable
          tree={tree}
          path={['root', 'results']}
          fields={schemas.movies.fields}
        />
        <pre>{JSON.stringify(tree, null, 2)}</pre>
      </div>
    )}
  </Awaiter>
)
