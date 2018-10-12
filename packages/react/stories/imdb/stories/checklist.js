import * as F from 'futil-js'
import _ from 'lodash/fp'
import React from 'react'
import { observable } from 'mobx'
import { fromPromise } from 'mobx-utils'
import { Provider, observer } from 'mobx-react'
import Contexture, { updateSchemas } from '../utils/contexture'
import { withStateLens } from '../../../src/utils/mobx-react-utils'
import { FilterList, Flex, Awaiter, SpacedList, Grid } from '../../../src'
import * as Theme from '../../../src/themes/greyVest'
let { GVStyle, Adder, Button, Pager, ExampleTypes, ButtonRadio } = Theme
let { ResultCount, CheckableResultTable, TypeMap, TagsQuery } = ExampleTypes

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
          showBestRange: true,
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
  autoUpdate: false,
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

let CheckboxResultTable = withStateLens({ selected: [] })(
  observer(({ selected, ...props }) => (
    <div>
      {JSON.stringify(F.view(selected))}
      <CheckableResultTable {...{ selected, ...props }} />
    </div>
  ))
)

export default () => (
  <div className="gv-body">
    <link
      href="https://fonts.googleapis.com/css?family=Lato:400,700,900"
      rel="stylesheet"
    />
    <GVStyle />
    <Awaiter promise={schemas}>
      {schemas => (
        <Provider tree={tree}>
          <Grid gap="22px" columns="1fr 4fr" style={{ margin: '0 22px' }}>
            <div>
              <h1>Filters</h1>
              <SpacedList>
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
              </SpacedList>
            </div>
            <div>
              <Grid columns="1fr 25px 150px" style={{ alignItems: 'center' }}>
                <TagsQuery path={['root', 'bar']} />
                {!state.autoUpdate && (
                  <Button onClick={tree.triggerUpdate} primary>
                    Search
                  </Button>
                )}
              </Grid>
              <Flex
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h1>
                  Results (<ResultCount path={['root', 'results']} />)
                </h1>
                <Flex>
                  <ButtonRadio
                    options={[
                      { label: 'AutoSearch On', value: true },
                      { label: 'AutoSearch Off', value: false },
                    ]}
                    value={state.autoUpdate}
                    onChange={val => {
                      tree.disableAutoUpdate = !val
                      state.autoUpdate = !!val
                    }}
                  />
                </Flex>
              </Flex>
              <div className="gv-box">
                <CheckboxResultTable
                  fields={schemas[tree.tree.schema].fields}
                  path={['root', 'results']}
                  criteria={['root', 'criteria']}
                  typeComponents={TypeMap}
                  getValue="title"
                />
                <Flex
                  style={{ justifyContent: 'space-around', padding: '10px' }}
                >
                  <Pager path={['root', 'results']} />
                </Flex>
              </div>
            </div>
          </Grid>
        </Provider>
      )}
    </Awaiter>
  </div>
)
