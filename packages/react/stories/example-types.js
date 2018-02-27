import React from 'react'
import {observable, extendObservable} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'

let tree = observable({
  facet: {
    key: 'facet',
    type: 'facet',
    path: ['facet'],
    values: ['a'],
    optionsFilter: '',
    context: {
      options: [
        {
          name: 'a',
          count: 15,
        },
        {
          name: 'b',
          count: 3,
        },
        {
          name: 'c',
          count: 1,
        },
      ],
    },
  },
  query: {
    key: 'searchQuery',
    path: ['query'],
    type: 'query',
    field: 'title',
    query: '',
  },
  range: {
    key: 'searchRange',
    path: ['range'],
    type: 'number',
    field: 'metaScore',
    min: 0,
    max: 100,
  },
  results: {
    key: 'results',
    path: ['results'],
    type: 'results',
    pageSize: 6,
    page: 1,
    context: {
      response: {
        count: 1,
        results: [
          {
            _id: '123',
            title: 'Some Result',
          },
          {
            _id: '124',
            title: 'Some Other Result',
          },
          {
            _id: '135',
            title: 'A Different Result',
          },
        ],
        startRecord: 1,
        endRecord: 1,
        totalRecords: 1,
      },
    },
  },
  dateHistogram: {
    key: 'releases',
    path: ['releases'],
    type: 'dateHistogram',
    key_field: 'released',
    value_field: 'imdbVotes',
    interval: '3650d',
    context: {
      entries: [
        {
          key: 0,
          doc_count: 1,
          count: 1,
          min: 625633,
          max: 625633,
          avg: 625633,
          sum: 625633,
        },
        {
          key: 315360000000,
          doc_count: 3,
          count: 3,
          min: 74450,
          max: 557731,
          avg: 355868.3333333333,
          sum: 1067605,
        },
        {
          key: 630720000000,
          doc_count: 2,
          count: 2,
          min: 82360,
          max: 376362,
          avg: 229361,
          sum: 458722,
        },
        {
          key: 946080000000,
          doc_count: 4,
          count: 4,
          min: 28087,
          max: 395463,
          avg: 275019.25,
          sum: 1100077,
        },
        {
          key: 1261440000000,
          doc_count: 1,
          count: 1,
          min: 264551,
          max: 264551,
          avg: 264551,
          sum: 264551,
        },
      ],
      maxDate: null,
      minDate: null,
    },
  },
})
let testTree = {
  getNode: ([path]) => tree[path],
  mutate([path], blob) {
    action('mutate')(path, blob)
    extendObservable(tree[path], blob)
  },
}
import SpacedList from '../src/example-types/SpacedList'
let Results = InjectTreeNode(
  observer(({node}) => (
    <Flex style={{alignItems: 'baseline', justifyContent: 'center'}}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {node.context.response.results.map(({_id, title}) => (
            <tr key={_id}>
              <td>{_id}</td>
              <td>{title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Flex>
  ))
)
let formatYear = x => new Date(x).getFullYear() + 1
import {
  Facet,
  Range,
  Query,
  ResultCount,
  DateHistogram,
  InjectTreeNode,
  Styles,
} from '../src/example-types/components'
import {Flex} from '../src/example-types/Flex'

export default () => storiesOf('Example Types', module).add('Example Components', () => (
  <div
    style={{
      backgroundColor: '#333',
      color: '#AAA',
      padding: '20px',
      borderRadius: '10px',
    }}>
    <Styles />
    <Provider tree={testTree}>
      <SpacedList>
        <Query path={['query']} />
        <Flex>
          <div style={{flex: 1}}>
            <SpacedList>
              <Facet path={['facet']} />
              <Facet path={['facet']} />
              <Range path={['range']} />
              <Range path={['range']} />
            </SpacedList>
          </div>
          <div style={{flex: 4}}>
            <SpacedList>
              <DateHistogram path={['dateHistogram']} format={formatYear} />
              <ResultCount path={['results']} />
              <Results path={['results']} />
            </SpacedList>
          </div>
        </Flex>
      </SpacedList>
    </Provider>
  </div>
))
