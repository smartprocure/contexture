import _ from 'lodash/fp.js'
import React from 'react'
import TestTree from '../stories/testTree.js'
import ThemePicker from '../../stories/themePicker.js'
import ResultTable from './index.js'
import { Observer } from 'mobx-react'
import { Box } from '../../greyVest/index.js'
import Contexture from 'contexture'
import ContextureMobx from '../../utils/contexture-mobx.js'
import memory from 'contexture/dist/esm/provider-memory/index.js'
import types from 'contexture/dist/esm/provider-memory/exampleTypes.js'

export default {
  title: 'ExampleTypes | ResultTable',
  component: ResultTable,
  decorators: [ThemePicker('greyVest')],
}

let style = (
  <style>
    {`
    .example-table tr:nth-child(even) {
      background-color: rgba(0, 0, 0, 0.5)
    }
    .example-table {
      background: white;
      color: #444;
      border-collapse: collapse;
    }
    .example-table td, .example-table th {
      padding: 5px
    }
    .example-table thead {
      border-bottom: solid 2px #ccc
    }
  `}
  </style>
)

export let customizations = () => (
  <div>
    {style}
    <ResultTable
      tree={TestTree()}
      path={['results']}
      theme={{ Table: (x) => <table className="example-table" {...x} /> }}
      infer
      fields={{
        a: {
          label: 'Colored Header',
          order: -2,
          HeaderCell: ({ style, ...props }) => (
            <th
              style={{ color: 'green', ...style }}
              {..._.omit('activeFilter', props)}
            />
          ),
        },
        b: {
          label: 'Hidden Remove Column',
          order: -3,
          hideRemoveColumn: true,
          HeaderCell: ({ style, ...props }) => (
            <th
              style={{ color: 'gray', ...style }}
              {..._.omit('activeFilter', props)}
            />
          ),
        },
        c: {
          label: 'Hidden Menu',
          order: -4,
          hideMenu: true,
          HeaderCell: ({ style, ...props }) => (
            <th
              style={{ color: 'gray', ...style }}
              {..._.omit('activeFilter', props)}
            />
          ),
        },
        title: {
          order: 1,
          Cell: (x) => <td style={{ color: 'red' }} {...x} />,
        },
      }}
      getRowKey={_.flow(_.get('_id'), (x) => `key-${x}`)}
    />
  </div>
)

export let displayFieldOptional = () => {
  let tree = TestTree((testTree) => {
    testTree.getNode(['results']).include = ['title', 'a', 'b']
    return testTree
  })
  return (
    <div>
      <ResultTable
        tree={tree}
        path={['results']}
        Table={(x) => <table className="example-table" {...x} />}
        fields={{
          title: {
            Cell: (x) => <td style={{ color: 'red' }} {...x} />,
          },
        }}
      />
    </div>
  )
}

export let pagination = () => {
  let data = _.times((x) => ({ _id: x, value: _.random(0, 20000) }), 221)
  let tree = {
    key: 'root',
    schema: 'test',
    children: [{ key: 'results', type: 'results', pageSize: 5 }],
  }
  let service = Contexture({
    debug: true,
    schemas: { test: { memory: { records: data } } },
    providers: { memory: { ...memory, types: types() } },
  })
  let search = ContextureMobx({ service })(tree)
  search.refresh(['root'])
  return (
    <Box>
      <Observer>
        {() => (
          <ResultTable
            fields={{ _id: { label: 'id' }, value: { label: 'val' } }}
            tree={search}
            path={['root', 'results']}
          />
        )}
      </Observer>
    </Box>
  )
}
