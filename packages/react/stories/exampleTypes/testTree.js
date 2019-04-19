import { observable, set } from 'mobx'
import { action } from '@storybook/addon-actions'
import _ from 'lodash/fp'

// Lifted from contexture-client since it's not exported
let treeLens = _.curry((tree, path, prop) => ({
  get: () => _.get(prop, tree.getNode(path)),
  set: value => tree.mutate(path, { [prop]: value }),
}))

export default (f = _.identity) => {
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
            name: '',
            count: 4,
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
    titleText: {
      key: 'titleText',
      path: ['titleText'],
      type: 'text',
      field: 'title',
      value: '',
    },
    tagsQuery: {
      key: 'tagsQuery',
      path: ['tagsQuery'],
      type: 'tagsQuery',
      field: 'title',
      tags: [],
    },
    number: {
      key: 'searchNumber',
      path: ['number'],
      type: 'number',
      field: 'metaScore',
      min: 0,
      max: 100,
    },
    geo: {
      key: 'geoSearch',
      path: ['geo'],
      type: 'geo',
      location: '',
      operator: 'within',
      radius: 1,
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
              a: 1,
              b: 2,
              c: 3,
              nested: {
                value: 4,
              },
            },
            {
              _id: '124',
              title: 'Some Other Result',
              a: 1,
              b: 4,
              c: 3,
              nested: {
                value: 5,
              },
            },
            {
              _id: '135',
              title: 'A Different Result',
              a: 1,
              b: 2,
              c: 3,
              nested: {
                value: 6,
              },
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
    mutate: _.curry(([path], blob) => {
      action('mutate')(path, blob)
      set(tree[path], blob)
    }),
  }
  testTree.lens = treeLens(testTree)

  let r = f(testTree)

  let Obj = function() {
    return r
  }
  Obj.prototype.toString = () => 'THIS IS A CONTEXTURE TEST TREE'

  return new Obj()
}
