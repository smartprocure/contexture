import _ from 'lodash/fp'
import React from 'react'
import TestTree from '../stories/testTree'
import ThemePicker from '../../stories/themePicker'
import ResultTable from '.'
import { Observer } from 'mobx-react'
import { Box } from '../../greyVest'
import Contexture from 'contexture'
import ContextureMobx from '../../utils/contexture-mobx'
import memory from 'contexture/src/provider-memory'
import types from 'contexture/src/provider-memory/exampleTypes'

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
      theme={{ Table: x => <table className="example-table" {...x} /> }}
      infer
      fields={{
        b: {
          label: 'Field B',
          order: -2,
          HeaderCell: ({ style, ...props }) => (
            <th
              style={{ color: 'green', ...style }}
              {..._.omit('activeFilter', props)}
            />
          ),
        },
        title: {
          order: 1,
          Cell: x => <td style={{ color: 'red' }} {...x} />,
        },
      }}
    />
  </div>
)

export let displayFieldOptional = () => {
  let tree = TestTree(testTree => {
    testTree.getNode(['results']).include = ['title', 'a', 'b']
    return testTree
  })
  return (
    <div>
      <ResultTable
        tree={tree}
        path={['results']}
        Table={x => <table className="example-table" {...x} />}
        fields={{
          title: {
            Cell: x => <td style={{ color: 'red' }} {...x} />,
          },
        }}
      />
    </div>
  )
}

export let pagination = () => {
  let data = _.times(x => ({ _id: x, value: _.random(0, 20000) }), 221)
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
