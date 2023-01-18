// DO NOT RENAME THIS FILE... because we need it to run before the other tests...
// No, we don't know why. We're sorry. #hackathon

import { Tree } from './util/tree.js'
import F from 'futil'
import _ from 'lodash/fp.js'
import ContextureClient from './index.js'
import mockService from './mockService.js'
import { observable, reaction, autorun, toJS, set } from 'mobx'

let mobxAdapter = { snapshot: toJS, extend: set, initObject: observable }
let ContextureMobx = _.curry((x, y) =>
  ContextureClient({ ...mobxAdapter, ...x })(y)
)
//,
// F.updateOn('add', action),
// F.updateOn('remove', action),
// F.updateOn('mutate', action),
// F.updateOn('refresh', action)
// )

let treeUtils = Tree

let simplifyObject = _.flow(F.compactObject, _.omitBy(_.isFunction))

describe('usage with mobx should generally work', () => {
  // TODO: make these generally self contained - some rely on previous test runs
  let tree = {
    key: 'root',
    join: 'and',
    children: [
      { key: 'filter', type: 'facet', values: [1, 2] },
      { key: 'results', type: 'results', context: { results: null } },
    ],
  }

  let responseData = {
    key: 'root',
    children: [
      {
        key: 'results',
        context: {
          count: 1,
          results: [{ title: 'Some result' }, { title: 'Some other result' }],
        },
        size: 20,
      },
      { key: 'filter', type: 'facet' },
    ],
  }
  let service = jest.fn(() => responseData)
  let Tree = ContextureMobx({ service, debounce: 1 })(tree)

  let reactor = jest.fn()

  it('should generally mutate and have updated contexts', async () => {
    let disposer = reaction(() => toJS(Tree.tree), reactor)
    await Tree.mutate(['root', 'filter'], {
      values: ['a'],
    })
    expect(service).toHaveBeenCalledTimes(1)
    let [dto, now] = service.mock.calls[0]
    expect(dto).toEqual({
      key: 'root',
      join: 'and',
      lastUpdateTime: now,
      children: [
        {
          key: 'filter',
          type: 'facet',
          values: ['a'],
          mode: 'include',
          filterOnly: true,
          optionsFilter: '',
        },
        {
          key: 'results',
          type: 'results',
          lastUpdateTime: now,
          page: 1,
          pageSize: 10,
        },
      ],
    })
    expect(reactor.mock.calls.length).toBeGreaterThan(1)
    disposer()
    expect(
      simplifyObject(treeUtils.lookup(['filter'], reactor.mock.calls[1][0]))
    ).toEqual({
      key: 'filter',
      type: 'facet',
      values: ['a'],
      hasValue: 1,
      mode: 'include',
      path: ['root', 'filter'],
      context: { options: [], cardinality: null },
      metaHistory: [],
    })
    // should update contexts
    expect(Tree.getNode(['root', 'results']).updating).toBe(false)
    expect(toJS(Tree.getNode(['root', 'results']).context)).toEqual({
      count: 1,
      results: [{ title: 'Some result' }, { title: 'Some other result' }],
    })
    expect(
      treeUtils.lookup(['results'], reactor.mock.lastCall[0]).context
    ).toEqual({
      count: 1,
      results: [{ title: 'Some result' }, { title: 'Some other result' }],
    })
  })

  it('should support add', async () => {
    reactor.mockClear()
    service.mockClear()
    let disposer = reaction(() => toJS(Tree.tree), reactor)

    await Tree.add(['root'], { key: 'newFilter', type: 'text' })
    expect(service).not.toHaveBeenCalled()
    await Tree.add(['root'], {
      key: 'newFilterWithValue',
      type: 'facet',
      values: 'asdf',
    })
    expect(service).toHaveBeenCalledTimes(1)
    expect(reactor.mock.calls.length).toBeGreaterThan(1)
    expect(
      simplifyObject(
        treeUtils.lookup(['newFilterWithValue'], reactor.mock.calls[2][0])
      )
    ).toEqual({
      key: 'newFilterWithValue',
      type: 'facet',
      mode: 'include',
      values: 'asdf',
      path: ['root', 'newFilterWithValue'],
      context: { options: [], cardinality: null },
      metaHistory: [],
    })
    disposer()
  })

  it('should support remove', async () => {
    reactor.mockClear()
    service.mockClear()
    let disposer = reaction(() => toJS(Tree.tree), reactor)

    await Tree.add(['root'], {
      key: 'newNotEmptyFilter',
      type: 'facet',
      context: { options: [1] },
    })
    expect(service).toHaveBeenCalledTimes(1)
    expect(reactor.mock.calls.length).toBeGreaterThan(1)
    expect(Tree.getNode(['root', 'newNotEmptyFilter'])).toBeDefined()

    let previousCallCount = reactor.mock.calls.length
    await Tree.remove(['root', 'newNotEmptyFilter'])
    expect(service).toHaveBeenCalledTimes(1)
    expect(reactor.mock.calls.length).toBeGreaterThan(previousCallCount)
    expect(Tree.getNode(['root', 'newNotEmptyFilter'])).not.toBeDefined()

    previousCallCount = reactor.mock.calls.length
    await Tree.add(['root'], {
      key: 'newFilterWithValueForRemoveTest',
      type: 'facet',
      values: 'asdf',
    })
    expect(service).toHaveBeenCalledTimes(2)
    expect(reactor.mock.calls.length).toBeGreaterThan(previousCallCount)
    expect(
      Tree.getNode(['root', 'newFilterWithValueForRemoveTest'])
    ).toBeDefined()

    previousCallCount = reactor.mock.calls.length
    await Tree.remove(['root', 'newFilterWithValueForRemoveTest'])
    expect(
      Tree.getNode(['root', 'newFilterWithValueForRemoveTest'])
    ).not.toBeDefined()
    expect(service).toHaveBeenCalledTimes(3)
    expect(reactor.mock.calls.length).toBeGreaterThan(previousCallCount)

    expect(
      simplifyObject(
        treeUtils.lookup(['newNotEmptyFilter'], reactor.mock.calls[0][0])
      )
    ).toEqual({
      key: 'newNotEmptyFilter',
      type: 'facet',
      mode: 'include',
      path: ['root', 'newNotEmptyFilter'],
      context: { options: [1] },
      values: [],
      metaHistory: [],
    })
    expect(
      _.flow(
        _.omit(['lastUpdateTime']),
        simplifyObject
      )(treeUtils.lookup(['newNotEmptyFilter'], reactor.mock.calls[1][0]))
    ).toEqual({
      key: 'newNotEmptyFilter',
      type: 'facet',
      mode: 'include',
      context: { options: [1] },
      path: ['root', 'newNotEmptyFilter'],
      values: [],
      metaHistory: [],
    })

    expect(
      treeUtils.lookup(
        ['newFilterWithValueForRemoveTest'],
        reactor.mock.calls[0][0]
      )
    ).toBeUndefined()
    expect(
      treeUtils.lookup(
        ['newFilterWithValueForRemoveTest'],
        reactor.mock.lastCall[0]
      )
    ).toBeUndefined()
    disposer()
  })

  it('should support retrieving results with different array sizes', async () => {
    reactor.mockClear()
    service.mockClear()
    let disposer = reaction(() => toJS(Tree.tree), reactor)

    await Tree.mutate(['root', 'filter'], { values: [1, 2, 3] })
    expect(service).toHaveBeenCalledTimes(1)
    expect(
      _.flow(
        _.get(['context', 'results']),
        _.toArray
      )(Tree.getNode(['root', 'results']))
    ).toEqual([{ title: 'Some result' }, { title: 'Some other result' }])
    treeUtils.lookup(['results'], responseData).context.results = [
      { title: 'New values' },
    ]
    await Tree.mutate(['root', 'filter'], { values: [1, 2, 3, 4] })
    expect(service).toHaveBeenCalledTimes(2)
    expect(
      _.flow(
        _.get(['context', 'results']),
        _.toArray
      )(Tree.getNode(['root', 'results']))
    ).toEqual([{ title: 'New values' }])
    disposer()
  })

  it('should refresh properly', async () => {
    await Tree.refresh(['root'])
    expect(service).toHaveBeenCalledTimes(3)
  })
  it('onUpdateByOthers should work with mobx (and not be called on self updates)', async () => {
    service.mockClear()
    let Tree = ContextureMobx({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        { key: 'results', type: 'results', page: 1 },
        { key: 'agencies', field: 'Organization.Name', type: 'facet' },
        { key: 'vendors', field: 'Vendor.Name', type: 'facet' },
      ],
    })
    // Get the results node instead of passing an array in to test case where dispatched path is an observable array
    let resultsNode = tree.getNode(['root', 'results'])
    await tree.mutate(resultsNode.path, { page: 2 })
    expect(tree.getNode(resultsNode.path).page).toBe(2)
    expect(service).toHaveBeenCalledTimes(1)
    await tree.mutate(['root', 'agencies'], { values: ['Other City'] })
    expect(tree.getNode(resultsNode.path).page).toBe(1)
    expect(service).toHaveBeenCalledTimes(2)
  })
  it(`should be possible to change a group's join property`, async () => {
    // This wasn't possible before this PR: https://github.com/smartprocure/contexture-client/pull/74
    service.mockClear()
    let Tree = ContextureMobx({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        { key: 'results', type: 'results', page: 1 },
        {
          key: 'subgroup',
          type: 'group',
          join: 'not',
          children: [
            {
              key: 'facetic',
              type: 'facet',
              field: 'facetfield',
              value: 'some value',
            },
          ],
        },
      ],
    })
    await tree.refresh(['root'])
    await tree.mutate(['root', 'subgroup'], { join: 'and' })
  })
  it('should match flat and nested trees after add', async () => {
    service.mockClear()
    let Tree = ContextureMobx({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'filter 1',
          type: 'facet',
          field: 'facetfield',
          value: 'some value',
        },
      ],
    })
    await tree.add(['root'], {
      key: 'filter 2',
      type: 'facet',
      field: 'facetfield',
      value: 'some value',
    })
    expect(tree.getNode(['root', 'filter 2'])).toBe(tree.tree.children[1])
  })
  it('Test that pushing into an observable array converts array items to observables different from what was pushed', () => {
    let tree = observable({ key: 'a', children: [{ key: 'b' }] })
    let plainNode = { key: 'c' }
    tree.children.push(plainNode)
    expect(tree.children[1]).not.toBe(plainNode)

    let observableNode = { key: 'd' }
    observableNode = observable(observableNode)
    tree.children.push(observableNode)
    expect(tree.children[2]).toBe(observableNode)
  })
  it('should support observing disableAutoUpdate', () => {
    service.mockClear()
    let reactor = jest.fn()
    let tree = ContextureMobx({ service, debounce: 1 })({
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'filter 1',
          type: 'facet',
          field: 'facetfield',
          value: 'some value',
        },
      ],
    })
    reaction(() => tree.disableAutoUpdate, reactor)
    tree.disableAutoUpdate = true
    expect(reactor).toHaveBeenCalledTimes(1)
  })
  it('should react to group fns', async () => {
    let service = jest.fn(mockService({}))
    let reactor = jest.fn()
    let tree = ContextureMobx(
      { service, debounce: 1 },
      {
        key: 'root',
        join: 'and',
        children: [
          { key: 'filter', field: 'facetField', type: 'facet', values: ['x'] },
          { key: 'results', type: 'results' },
        ],
      }
    )
    autorun(() => reactor(tree.getNode(['root']).markedForUpdate))
    await tree.mutate(['root', 'filter'], { values: ['other Value'] })

    expect(service).toHaveBeenCalledTimes(1)
    // once on initial run to false, then true, then again back to false
    expect(reactor).toHaveBeenCalledTimes(3)
  })
})
