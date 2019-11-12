import * as F from 'futil'
import _ from 'lodash/fp'
import React from 'react'
import { observable } from 'mobx'
import { fromPromise } from 'mobx-utils'
import { observer } from 'mobx-react'
import Contexture, { updateSchemas } from '../utils/contexture'

import { useTheme } from '../../../utils/theme'
import {
  FilterList,
  Flex,
  Awaiter,
  SpacedList,
  Grid,
  componentForType,
  FilterAdder,
} from '../../..'
import {
  ResultCount,
  CheckableResultTable,
  ResultPager,
  TagsQuery,
  TypeMap,
} from '../../../exampleTypes'
import IMDBCards from '../components/IMDBCards'

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
        '_checkbox',
        'poster',
        'title',
        'actors',
        'genres',
        'rated',
        'released',
      ],
    },
  ],
})
tree.disableAutoUpdate = true

let state = observable({
  showCards: true,
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
              display: x => <span dangerouslySetInnerHTML={{ __html: x }} />,
              order: 1,
            },
            genres: { display: divs },
            actors: { display: divs },
          },
        },
      })
    )
    .then(_.tap(() => tree.refresh(['root'])))
)

let CheckboxResultTable = observer(props => {
  let selected = React.useState([])
  return (
    <div>
      {JSON.stringify(F.view(selected))}
      <CheckableResultTable {...{ selected, ...props }} />
    </div>
  )
})

export default () => {
  let theme = useTheme()
  return (
    <Awaiter promise={schemas}>
      {schemas => (
        <Grid gap="22px" columns="1fr 4fr" style={{ margin: '22px' }}>
          <div>
            <h1>Filters</h1>
            <SpacedList>
              <FilterList
                tree={tree}
                path={['root', 'criteria']}
                fields={schemas.movies.fields}
                mapNodeToProps={F.mergeOverAll([
                  componentForType(TypeMap),
                  field =>
                    field.key === 'searchNumber' ? { showBestRange: true } : {},
                ])}
              />
              <FilterAdder
                tree={tree}
                path={['root', 'criteria']}
                fields={schemas.movies.fields}
                uniqueFields
              />
            </SpacedList>
          </div>
          <div>
            <Grid columns="1fr auto" style={{ alignItems: 'center' }}>
              <TagsQuery tree={tree} path={['root', 'bar']} />
              {tree.disableAutoUpdate && (
                <theme.Button onClick={tree.triggerUpdate} primary>
                  Search
                </theme.Button>
              )}
            </Grid>
            <Flex
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h1>
                Results (<ResultCount tree={tree} path={['root', 'results']} />)
              </h1>
              <Flex>
                <theme.RadioList
                  options={[
                    { label: 'AutoSearch On', value: true },
                    { label: 'AutoSearch Off', value: false },
                  ]}
                  value={!tree.disableAutoUpdate}
                  onChange={val => {
                    tree.disableAutoUpdate = !val
                  }}
                />
              </Flex>
            </Flex>
            <theme.Box>
              <Flex>
                <theme.RadioList
                  options={[
                    { label: 'Title Cards', value: true },
                    { label: 'Checkable Table', value: false },
                  ]}
                  value={state.showCards}
                  onChange={val => {
                    state.showCards = val
                  }}
                />
              </Flex>
              {state.showCards ? (
                <IMDBCards tree={tree} path={['root', 'results']} />
              ) : (
                <CheckboxResultTable
                  tree={tree}
                  fields={schemas[tree.tree.schema].fields}
                  path={['root', 'results']}
                  criteria={['root', 'criteria']}
                  mapNodeToProps={componentForType(TypeMap)}
                  getValue="title"
                />
              )}
              <Flex style={{ justifyContent: 'space-around', padding: '10px' }}>
                <ResultPager tree={tree} path={['root', 'results']} />
              </Flex>
            </theme.Box>
          </div>
        </Grid>
      )}
    </Awaiter>
  )
}
