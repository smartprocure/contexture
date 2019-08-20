import _ from 'lodash/fp'
import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from '../testTree'
import ExampleTypes from '../../src/exampleTypes'
let { ResultTable } = ExampleTypes

storiesOf('Search Components (Unthemed)|Example Types/ResultTable', module)
  .addWithJSX('Customizations', () => (
    <div>
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
      <ResultTable
        tree={TestTree()}
        path={['results']}
        Table={x => <table className="example-table" {...x} />}
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
  ))
  .addWithJSX('Display Field Optional', () => {
    let tree = TestTree(testTree => {
      testTree.getNode(['results']).include = ['title', 'a', 'b']
      return testTree
    })
    return (
      <div>
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
  })
