import _ from 'lodash/fp'
import React from 'react'
import { Provider } from 'mobx-react'
import { fromPromise } from 'mobx-utils'
import QueryBuilder from '../../../src/queryBuilder/'
import { ResultCount, ResultTable, TypeMap } from '../../../src/exampleTypes/'
import { Awaiter } from '../../../src/layout/'
import Contexture, { esClient } from '../utils/contexture'
import { getESSchemas } from '../../../src/utils/schema'

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
      <div>
        <Provider tree={tree}>
          <div>
            <QueryBuilder
              types={TypeMap}
              fields={schemas.movies.fields}
              path={['root', 'searchRoot']}
            />
            <h1>
              <ResultCount path={['root', 'results']} />
            </h1>
            <ResultTable path={['root', 'results']} infer />
          </div>
        </Provider>
        <pre>{JSON.stringify(tree, null, 2)}</pre>
      </div>
    )}
  </Awaiter>
)
