import _ from 'lodash/fp'
import React from 'react'
import { Provider } from 'mobx-react'
import { fromPromise } from 'mobx-utils'
import SearchRoot from '../../../src/queryBuilder/SearchRoot'
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
    _.update(
      'movies.fields',
      _.flow(
        _.merge(_, {
          released: {
            label: 'Release Date',
          },
          // ...flagFields({
          //   isCommon: ['plot', 'title'],
          // }),
        }),
        _.omit(['imdbId', 'yearEnded'])
      )
    )
  )
)


export default () => (
  <Awaiter promise={schemas}>
    {schemas => (
  <div>
    <Provider tree={tree}>
      <div>
        <SearchRoot types={TypeMap} fields={schemas.movies.fields} path={['root', 'searchRoot']}  />
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