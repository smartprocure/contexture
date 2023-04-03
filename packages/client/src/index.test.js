import { jest } from '@jest/globals'
import _ from 'lodash/fp.js'
import F from 'futil'
import ContextureClient, { encode, exampleTypes } from './index.js'
import Promise from 'bluebird'
import mockService from './mockService.js'
import wrap from './actions/wrap.js'
import { observable, toJS, set } from 'mobx'
import { skipResetExpansionsFields } from './exampleTypes/pivot.js'

let mobxAdapter = { snapshot: toJS, extend: set, initObject: observable }
let ContextureMobx = _.curry((x, y) =>
  ContextureClient({ ...mobxAdapter, ...x })(y)
)

let addDelay =
  (delay, fn) =>
  async (...args) => {
    await Promise.delay(delay)
    return fn(...args)
  }

let AllTests = (ContextureClient) => {
  describe('should generally work', () => {
    // TODO: make these generally self contained - some rely on previous test runs
    let tree = {
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'filter',
          type: 'facet',
        },
        {
          key: 'results',
          type: 'results',
        },
      ],
    }
    let service = jest.fn(mockService())
    let Tree = ContextureClient({ service, debounce: 1 }, tree)

    it('should support per-node onSerialize hook', () => {
      let types = _.merge(exampleTypes, {
        results: {
          onSerialize: _.flow(
            _.set('customKey', 'customValue'),
            _.unset('pageSize')
          ),
        },
      })
      let Tree = ContextureClient({ service, debounce: 0, types }, tree)
      expect(Tree.serialize()).toEqual({
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'filter',
            type: 'facet',
            mode: 'include',
            values: [],
            optionsFilter: '',
          },
          {
            key: 'results',
            type: 'results',
            page: 1,
            customKey: 'customValue',
            view: 'table',
          },
        ],
      })
    })
    it('should generally mutate', async () => {
      await Tree.mutate(['root', 'filter'], {
        values: ['a'],
      })
      expect(service).toBeCalledTimes(1)
      let [dto, now] = service.mock.calls[0]
      expect(dto).toEqual({
        key: 'root',
        join: 'and',
        lastUpdateTime: now,
        children: [
          {
            key: 'filter',
            type: 'facet',
            mode: 'include',
            values: ['a'],
            filterOnly: true,
            optionsFilter: '',
          },
          {
            key: 'results',
            type: 'results',
            page: 1,
            pageSize: 10,
            lastUpdateTime: now,
            view: 'table',
          },
        ],
      })
    })
    it('should update contexts', () => {
      expect(Tree.getNode(['root', 'results']).updating).toBe(false)
      expect(toJS(Tree.getNode(['root', 'results']).context)).toEqual({
        count: 1,
        results: [
          {
            title: 'some result',
          },
        ],
      })
    })
    it('should serialize cleanly', () => {
      expect(Tree.serialize()).toEqual({
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'filter',
            type: 'facet',
            mode: 'include',
            values: ['a'],
            optionsFilter: '',
          },
          {
            key: 'results',
            type: 'results',
            page: 1,
            pageSize: 10,
            view: 'table',
          },
        ],
      })
    })
    it('should not block blank searches', async () => {
      service.mockClear()
      await Tree.mutate(['root', 'filter'], {
        values: [],
      })
      expect(service).toBeCalledTimes(1)
    })
    it('should not search if nothing needs updating', async () => {
      service.mockClear()
      expect(service).toBeCalledTimes(0)
      await Tree.dispatch({
        path: ['root'],
        type: 'notAType',
      })
      expect(service).toBeCalledTimes(0)
    })
    // it('should not dispatch if there is no mutation')
    it('should handle join changes', async () => {
      service.mockClear()
      expect(service).toBeCalledTimes(0)
      Tree.getNode(['root', 'filter']).values = ['real val']
      await Tree.mutate(['root'], {
        join: 'or',
      })
      expect(service).toBeCalledTimes(0)
      await Tree.mutate(['root'], {
        join: 'not',
      })
      expect(service).toBeCalledTimes(1)
      // let [dto] = service.mock.calls[0]
      // console.log('call', dto)
    })
    it('should support add', async () => {
      service.mockClear()
      await Tree.add(['root'], {
        key: 'newFilter',
        type: 'text',
      })
      expect(service).toBeCalledTimes(0)
      await Tree.add(['root'], {
        key: 'newFilterWithValue',
        type: 'text',
        value: 'asdf',
      })
      expect(service).toBeCalledTimes(1)
    })
    it('should support remove', async () => {
      service.mockClear()
      await Tree.add(['root'], {
        key: 'newEmptyFilter',
        type: 'text',
      })
      expect(service).toBeCalledTimes(0)
      expect(Tree.getNode(['root', 'newEmptyFilter'])).toBeDefined()
      await Tree.remove(['root', 'newEmptyFilter'])
      expect(service).toBeCalledTimes(0)
      expect(Tree.getNode(['root', 'newEmptyFilter'])).not.toBeDefined()

      await Tree.add(['root'], {
        key: 'newFilterWithValueForRemoveTest',
        type: 'facet',
        values: 'asdf',
      })
      expect(service).toBeCalledTimes(1)
      expect(
        Tree.getNode(['root', 'newFilterWithValueForRemoveTest'])
      ).toBeDefined()
      await Tree.remove(['root', 'newFilterWithValueForRemoveTest'])
      expect(
        Tree.getNode(['root', 'newFilterWithValueForRemoveTest'])
      ).not.toBeDefined()
      expect(service).toBeCalledTimes(2)
    })
    it('should support refresh', async () => {
      service.mockClear()
      await Tree.refresh(['root'])
      expect(service).toBeCalledTimes(1)
    })

    it.todo('should support field changes')
    it.todo('should probably support type changes ¯\\_(ツ)_/¯')

    it('should (un)pause', async () => {
      service.mockClear()
      await Tree.mutate(['root', 'filter'], {
        paused: true,
      })
      // Unpause here shouldn't trigger update since it didn't miss anything
      await Tree.mutate(['root', 'filter'], {
        paused: false,
      })
      await Tree.mutate(['root', 'filter'], {
        paused: true,
      })
      // This shouldn't trigger a search because it's paused
      await Tree.mutate(['root', 'filter'], {
        size: 42,
      })
      expect(service).toBeCalledTimes(0)
      expect(Tree.getNode(['root', 'filter']).paused).toBe(true)
      expect(Tree.getNode(['root', 'filter']).missedUpdate).toBe(true)
      // Unpause here should trigger this to run
      await Tree.mutate(['root', 'filter'], {
        paused: false,
      })
      expect(service).toBeCalledTimes(1)
      expect(Tree.getNode(['root', 'filter']).paused).toBe(false)
      expect(Tree.getNode(['root', 'filter']).missedUpdate).toBe(false)
    })
    it.todo('should handle groups being paused')
  })
  it('should throw if no service is provided', async () => {
    let Tree = ContextureClient(
      {
        debounce: 1,
      },
      {
        key: 'root',
        children: [
          {
            key: 'filter',
            type: 'facet',
          },
          {
            key: 'results',
          },
        ],
      }
    )
    try {
      await Tree.mutate(['root', 'filter'], {
        values: ['cable'],
      })
    } catch (e) {
      expect(e.message).toBe('No update service provided!')
      return
    }
    throw Error('Should have thrown')
  })
  it('should work', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient(
      { service, debounce: 1 },
      {
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'analysis',
            join: 'and',
            children: [
              {
                key: 'results',
                type: 'results',
              },
            ],
          },
          {
            key: 'criteria',
            join: 'or',
            children: [
              {
                key: 'agencies',
                field: 'Organization.Name',
                type: 'facet',
                lastUpdateTime: null,
                values: ['City of Deerfield'],
                size: 24,
              },
              {
                key: 'mainQuery',
                type: 'query',
                query: 'cable internet~',
              },
            ],
          },
        ],
      }
    )

    await Tree.mutate(['root', 'criteria', 'mainQuery'], {
      query: 'cable',
    })
    expect(service).toBeCalledTimes(1)
    let [dto, now] = service.mock.calls[0]
    expect(dto).toEqual({
      key: 'root',
      join: 'and',
      lastUpdateTime: now,
      children: [
        {
          key: 'analysis',
          join: 'and',
          children: [
            {
              key: 'results',
              type: 'results',
              lastUpdateTime: now,
              page: 1,
              pageSize: 10,
              view: 'table',
            },
          ],
          lastUpdateTime: now,
        },
        {
          key: 'criteria',
          join: 'or',
          children: [
            {
              key: 'agencies',
              field: 'Organization.Name',
              type: 'facet',
              values: ['City of Deerfield'],
              mode: 'include',
              size: 24,
              filterOnly: true,
              optionsFilter: '',
            },
            {
              key: 'mainQuery',
              type: 'query',
              query: 'cable',
              filterOnly: true,
            },
          ],
        },
      ],
    })
  })
  it('should call onResult and drop stale updates', async () => {
    let tree = {
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'filter',
          type: 'facet',
        },
        {
          key: 'results',
          type: 'results',
        },
      ],
    }
    let service = jest.fn(async (dto, lastUpdateTime) => {
      let testChange = dto.children[0].values[0]
      // arbitrarily delay the first call to trigger a stale update
      await Promise.delay(testChange === 'a' ? 20 : 1)
      return mockService()(dto, lastUpdateTime)
    })

    let spy = jest.fn()
    // Just call the spy for `results`
    let onResult = (path) => _.isEqual(path, ['root', 'results']) && spy()
    let Tree = ContextureClient(
      {
        service,
        debounce: 1,
        onResult,
      },
      tree
    )
    let step1 = Tree.mutate(['root', 'filter'], {
      values: ['a'],
    })
    // Give it enough time for the server to trigger a search for step 1 (but not awaiting step1 because that would also wait for the service)
    await Promise.delay(10)
    let step2 = Tree.mutate(['root', 'filter'], {
      values: ['b'],
    })
    await Promise.all([step1, step2])
    expect(spy).toBeCalledTimes(1)
  })
  it('should call onError when the service returns error', async () => {
    let tree = {
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'filter',
          type: 'facet',
        },
        {
          key: 'results',
          type: 'results',
        },
      ],
    }
    let service = jest.fn(async () => {
      throw 'service error!'
    })

    let spy = jest.fn()
    // Just call the spy for `onError`
    let onError = () => spy()
    let Tree = ContextureClient(
      {
        service,
        debounce: 1,
        onError,
      },
      tree
    )
    let step1 = Tree.mutate(['root', 'filter'], {
      values: ['a'],
    })
    await Promise.delay(20)
    await Promise.resolve(step1)
    expect(spy).toBeCalledTimes(1)
  })
  it('onError tree should be back to normal - no updating flags etc', async () => {
    let service = jest.fn(async () => {
      throw 'service error!'
    })
    let spy = jest.fn()
    let onError = () => spy()
    let tree = ContextureClient(
      {
        debounce: 0,
        service,
        types: {
          facet: {
            reactors: {
              values: 'others',
            },
          },
        },
        onError,
      },
      {
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'a',
            type: 'facet',
          },
          {
            key: 'b',
            type: 'results',
          },
        ],
      }
    )
    let step1 = tree.mutate(['root', 'a'], { values: [1] })
    await Promise.delay(5)
    await Promise.resolve(step1)
    expect(spy).toBeCalledTimes(1)
    let node = tree.getNode(['root', 'b'])
    expect(node.updating).toBe(false)
    await node.updatingPromise
    expect(node.updating).toBe(false)
  })
  it('should throw when the service crashes', async () => {
    let tree = {
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'filter',
          type: 'facet',
        },
        {
          key: 'results',
          type: 'results',
        },
      ],
    }
    let service = jest.fn(async () => {
      throw 'service error!'
    })

    let Tree = ContextureClient(
      {
        service,
        debounce: 1,
      },
      tree
    )
    try {
      await Tree.mutate(['root', 'filter'], {
        values: ['a'],
      })
    } catch (e) {
      expect(e).toBe('service error!')
    }
  })
  it('should support custom type reactors', async () => {
    let service = jest.fn(mockService())
    let resultsUpdated = jest.fn()
    let filterUpdated = jest.fn()
    let onResult = _.cond([
      [_.isEqual(['root', 'results']), resultsUpdated],
      [_.isEqual(['root', 'filter']), filterUpdated],
    ])

    let Tree = ContextureClient(
      {
        debounce: 1,
        types: {
          testType: {
            reactors: {
              value: 'others',
              optionType: 'self',
            },
          },
        },
        service,
        onResult,
      },
      {
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'filter',
            type: 'testType',
          },
          {
            key: 'results',
            type: 'results',
          },
        ],
      }
    )
    await Tree.mutate(['root', 'filter'], {
      value: 'a',
    })
    expect(service).toBeCalledTimes(1)
    expect(resultsUpdated).toBeCalledTimes(1)
    expect(filterUpdated).toBeCalledTimes(0)
    await Tree.mutate(['root', 'filter'], {
      optionType: 2,
    })
    expect(service).toBeCalledTimes(2)
    expect(resultsUpdated).toBeCalledTimes(1)
    expect(filterUpdated).toBeCalledTimes(1)
  })
  it('should support custom type initializers', async () => {
    let testInit = jest.fn((node, extend) => extend(node, { isExtended: true }))
    let Tree = ContextureClient(
      {
        debounce: 1,
        types: {
          testType: {
            init: testInit,
          },
        },
      },
      {
        key: 'root',
        children: [
          {
            key: 'filter',
            type: 'testType',
          },
        ],
      }
    )
    expect(testInit).toBeCalledTimes(1)
    expect(Tree.getNode(['root', 'filter']).isExtended).toBe(true)
  })
  it('should support custom type defaults', async () => {
    let Tree = ContextureClient(
      {
        debounce: 1,
        types: {
          testType: {
            defaults: {
              isExtended: true,
              context: {
                example: 0,
              },
            },
          },
        },
      },
      {
        key: 'root',
        children: [
          {
            key: 'filter',
            type: 'testType',
          },
        ],
      }
    )
    expect(Tree.getNode(['root', 'filter']).isExtended).toBe(true)
    expect(Tree.getNode(['root', 'filter']).context.example).toBe(0)
  })
  it('should custom type reactors should work with and without values, and nested', async () => {
    let service = jest.fn(mockService({}))
    let resultsUpdated = jest.fn()
    let filterUpdated = jest.fn()
    let onResult = _.cond([
      [_.isEqual(['root', 'results']), resultsUpdated],
      [_.isEqual(['root', 'filter']), filterUpdated],
    ])

    let Tree = ContextureClient(
      {
        debounce: 1,
        types: {
          testType: {
            reactors: {
              value: 'others',
            },
          },
        },
        service,
        onResult,
      },
      {
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'filter',
            type: 'testType',
            value: null,
          },
          {
            key: 'filterNoData',
            type: 'testType',
            value: null,
          },
          {
            key: 'filterGroup',
            type: 'group',
            children: [
              {
                key: 'filterChild',
                type: 'testType',
                value: null,
              },
            ],
          },
          {
            key: 'results',
            type: 'results',
            context: {
              results: null,
            },
          },
        ],
      }
    )
    await Tree.mutate(['root', 'filter'], {
      value: 'z',
    })
    expect(service).toBeCalledTimes(1)
    expect(resultsUpdated).toBeCalledTimes(1)
    expect(filterUpdated).toBeCalledTimes(0)
    await Tree.mutate(['root', 'filterNoData'], {
      value: 'z',
    })
    expect(service).toBeCalledTimes(2)
    expect(resultsUpdated).toBeCalledTimes(2)
    expect(filterUpdated).toBeCalledTimes(1)
    await Tree.mutate(['root', 'filterGroup', 'filterChild'], {
      value: 'z',
    })
    expect(service).toBeCalledTimes(3)
    expect(resultsUpdated).toBeCalledTimes(3)
    expect(filterUpdated).toBeCalledTimes(2)
  })
  it('Tree lenses should work', async () => {
    let service = jest.fn(mockService({}))
    let resultsUpdated = jest.fn()
    let filterUpdated = jest.fn()
    let onResult = _.cond([
      [_.isEqual(['root', 'results']), resultsUpdated],
      [_.isEqual(['root', 'filter']), filterUpdated],
    ])

    let Tree = ContextureClient(
      {
        debounce: 1,
        onResult,
        service,
      },
      {
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'filter',
            type: 'facet',
            values: null,
          },
          {
            key: 'results',
            type: 'results',
            context: {
              results: null,
            },
          },
        ],
      }
    )
    let lens = Tree.lens(['root', 'filter'])('values')
    expect(lens.get()).toBeNull()
    await lens.set(['values'])
    expect(toJS(lens.get())).toEqual(['values'])
    expect(filterUpdated).toBeCalledTimes(0)
    expect(resultsUpdated).toBeCalledTimes(1)
  })
  it('should support custom actions', async () => {
    let service = jest.fn(mockService({}))
    let tree = ContextureClient(
      {
        debounce: 1,
        service,
      },
      {
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'a',
          },
          {
            key: 'b',
            special: true,
          },
          {
            key: 'c',
          },
        ],
      }
    )
    tree.addActions(({ getNode, flat }) => ({
      shallowRekey(path, newKey) {
        let node = getNode(path)
        node.key = newKey
        node.path.splice(-1, 1, newKey)
        delete flat[encode(path)]
        flat[encode(node.path)] = node
      },
    }))
    let node = tree.getNode(['root', 'b'])
    tree.shallowRekey(['root', 'b'], 'f')
    await tree.dispatch({ type: 'all', path: ['root', 'a'] })
    expect(service).toBeCalledTimes(1)
    let [dto, now] = service.mock.calls[0]
    expect(dto).toEqual({
      key: 'root',
      join: 'and',
      lastUpdateTime: now,
      children: [
        {
          key: 'a',
          lastUpdateTime: now,
        },
        {
          key: 'f', // key is F
          special: true,
          lastUpdateTime: now,
        },
        {
          key: 'c',
          lastUpdateTime: now,
        },
      ],
    })
    let newNode = tree.getNode(['root', 'f'])
    expect(node).toEqual(newNode)
    expect(newNode.key).toBe('f')
    expect(newNode.special).toBe(true)
  })
  it('should support custom reactors', async () => {
    let service = jest.fn(mockService({}))
    let tree = ContextureClient(
      {
        debounce: 1,
        service,
      },
      {
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'a',
          },
          {
            key: 'b',
            special: true,
          },
          {
            key: 'c',
            special: true,
          },
        ],
      }
    )
    tree.addReactors(() => ({
      onlySpecial: (parent) => _.filter('special', parent.children),
    }))
    await tree.dispatch({ type: 'onlySpecial', path: ['root', 'b'] })
    expect(service).toBeCalledTimes(1)
    let [dto, now] = service.mock.calls[0]
    expect(dto).toEqual({
      key: 'root',
      join: 'and',
      lastUpdateTime: now,
      children: [
        {
          key: 'a',
          filterOnly: true,
        },
        {
          key: 'b',
          special: true,
          lastUpdateTime: now,
        },
        {
          key: 'c',
          special: true,
          lastUpdateTime: now,
        },
      ],
    })
  })
  it('should support updatingPromise', async () => {
    let spy = jest.fn(mockService({}))
    let service = async (...args) => {
      // Add an artificial delay so we can see when updating starts
      await Promise.delay(10)
      return spy(...args)
    }
    let tree = ContextureClient(
      {
        debounce: 0,
        service,
        types: {
          facet: {
            reactors: {
              values: 'others',
            },
          },
        },
      },
      {
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'a',
            type: 'facet',
          },
          {
            key: 'b',
            type: 'results',
          },
        ],
      }
    )
    tree.mutate(['root', 'a'], { values: [1] })
    let node = tree.getNode(['root', 'b'])
    // Allow updating to start (after debounce elaspses) but before the service finishes
    await Promise.delay(5)
    expect(node.updating).toBe(true)
    await node.updatingPromise
    expect(node.updating).toBe(false)
  })
  describe('Previously fixed bugs', () => {
    it('should not incorrectly mark siblings for update when their parents are marked on self', async () => {
      let service = addDelay(10, jest.fn(mockService()))
      let Tree = ContextureClient({ service, debounce: 1 })
      let tree = Tree({
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'criteria',
            join: 'and',
            children: [
              {
                key: 'agencies',
                field: 'Organization.Name',
                type: 'facet',
              },
              {
                key: 'vendors',
                field: 'Vendor.Name',
                type: 'facet',
              },
            ],
          },
        ],
      })
      await tree.mutate(['root', 'criteria', 'agencies'], { size: 12 })
      expect(
        tree.getNode(['root', 'criteria', 'vendors']).lastUpdateTime
      ).toBeNull()
    })
    it('should not prevent siblings from updating', async () => {
      let service = addDelay(10, jest.fn(mockService()))
      let Tree = ContextureClient({ service, debounce: 1 })
      let tree = Tree({
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'analysis',
            join: 'and',
            children: [
              {
                key: 'results',
                type: 'results',
              },
            ],
          },
          {
            key: 'criteria1',
            join: 'and',
            children: [
              {
                key: 'agencies',
                field: 'Organization.Name',
                type: 'facet',
                values: ['City of Deerfield'],
                size: 24,
              },
              {
                key: 'vendors',
                field: 'Vendor.Name',
                type: 'facet',
                values: ['City of Deerfield'],
                size: 24,
              },
            ],
          },
          {
            key: 'criteria2',
            join: 'and',
            children: [
              {
                key: 'agencies2',
                field: 'Organization.Name',
                type: 'facet',
                values: ['City of Deerfield'],
                size: 24,
              },
              {
                key: 'vendors2',
                field: 'Vendor.Name',
                type: 'facet',
                values: ['City of Deerfield'],
                size: 24,
              },
            ],
          },
        ],
      })
      tree.mutate(['root', 'criteria1', 'agencies'], { size: 12 })
      await tree.mutate(['root', 'criteria2', 'agencies2'], {
        values: ['Other City'],
      })
      // Previously, we would not mark for update if any children already were, which would prevent siblings
      //  of things markedForUpdate from being correctly updated by other parts of the tree
      expect(
        tree.getNode(['root', 'criteria1', 'vendors']).lastUpdateTime
      ).not.toBeNull()
    })
    it('should not keep nodes without results updating forever', async () => {
      let service = jest.fn(mockService())
      let Tree = ContextureClient({ debounce: 1, service })
      let tree = Tree({
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'results',
            type: 'results',
            page: 1,
          },
          {
            key: 'agencies',
            field: 'Organization.Name',
            type: 'facet',
          },
          {
            key: 'vendors',
            field: 'Vendor.Name',
            type: 'text',
          },
        ],
      })
      expect(!!tree.getNode(['root', 'vendors']).updating).toBe(false)
      await tree.mutate(['root', 'agencies'], { values: ['City of Deerfield'] })
      // Since this is `text`, it won't get a context back but should still not be updating
      expect(!!tree.getNode(['root', 'vendors']).updating).toBe(false)
    })
  })
  it('should support subquery', async () => {
    let spy = jest.fn(
      mockService({
        mocks({ type }) {
          if (type === 'facet')
            return {
              options: [{ name: 1 }, { name: 2 }],
            }
          if (type === 'results')
            return {
              count: 1,
              results: [{ title: 'some result' }],
            }
        },
      })
    )
    let service = addDelay(10, spy)
    let types = {
      facet: {
        reactors: { values: 'others' },
        subquery: {
          useValues: (x) => ({ values: x }),
          getValues: (x) => _.map('name', x.context.options),
        },
        defaults: {
          context: {
            options: [],
          },
        },
      },
    }
    let Tree = ContextureClient({ debounce: 1, service, types })

    let sourceTree = Tree({
      key: 'innerRoot',
      join: 'and',
      children: [
        { key: 'c', type: 'facet' },
        { key: 'd', type: 'facet' },
      ],
    })
    let targetTree = Tree({
      key: 'root',
      join: 'and',
      children: [
        { key: 'a', type: 'facet' },
        { key: 'b', type: 'results' },
      ],
    })

    // subquery(types, targetTree, ['root', 'a'], sourceTree, ['innerRoot', 'c'])
    targetTree.subquery(['root', 'a'], sourceTree, ['innerRoot', 'c'])
    targetTree.dispatch({ type: 'all', path: ['root', 'b'] })
    let promise = sourceTree.mutate(['innerRoot', 'd'], { values: ['test'] })

    await promise
    expect(
      toJS(sourceTree.getNode(['innerRoot', 'c']).context.options)
    ).toEqual([{ name: 1 }, { name: 2 }])
    expect(toJS(targetTree.getNode(['root', 'a']).values)).toEqual([1, 2])

    // Mutate on sourceTree will await the Subquery into targetTree
    // so results are fetched only once despite dispatching them directly
    expect(spy).toBeCalledTimes(2)

    expect(targetTree.getNode(['root', 'b']).markedForUpdate).toBe(false)
    expect(targetTree.getNode(['root', 'b']).updating).toBe(false)
    expect(targetTree.getNode(['root', 'b']).context.count).toBe(1)
  })
  it('should support subquery clearing target tree', async () => {
    let spy = jest.fn(
      mockService({
        mocks({ key, type }) {
          if (type === 'facet')
            return {
              options: {
                c: [],
                a: [{ name: 3 }, { name: 4 }],
              }[key],
            }
          if (type === 'results')
            return {
              count: 1,
              results: [{ title: 'some result' }],
            }
        },
      })
    )
    let service = addDelay(10, spy)
    let types = {
      facet: {
        reactors: { values: 'others' },
        subquery: {
          useValues: (x) => ({ values: x }),
          getValues: (x) => _.map('name', x.context.options),
        },
        defaults: {
          context: {
            options: [],
          },
        },
      },
    }
    let Tree = ContextureClient({ debounce: 1, service, types })

    let sourceTree = Tree({
      key: 'innerRoot',
      join: 'and',
      children: [
        { key: 'c', type: 'facet' },
        { key: 'd', type: 'facet' },
      ],
    })
    let targetTree = Tree({
      key: 'root',
      join: 'and',
      children: [
        { key: 'a', type: 'facet', values: [] },
        { key: 'b', type: 'results' },
      ],
    })

    targetTree.subquery(['root', 'a'], sourceTree, ['innerRoot', 'c'])
    targetTree.dispatch({ type: 'all', path: ['root', 'b'] })
    let promise = sourceTree.mutate(['innerRoot', 'd'], { values: ['test'] })

    await promise
    expect(sourceTree.getNode(['innerRoot', 'c']).context.options).toEqual([])
    expect(targetTree.getNode(['root', 'a']).values).toEqual([])

    // Mutate on sourceTree will await the Subquery into targetTree
    // so results are fetched only once despite dispatching them directly
    expect(spy).toBeCalledTimes(2)
  })
  it('should respect disableAutoUpdate', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({
      service,
      debounce: 1,
      disableAutoUpdate: true,
    })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'results',
          type: 'results',
        },
        {
          key: 'agencies',
          field: 'Organization.Name',
          type: 'facet',
        },
        {
          key: 'vendors',
          field: 'Vendor.Name',
          type: 'facet',
        },
      ],
    })
    // With disableAutoUpdate, search should not go through
    await tree.mutate(['root', 'agencies'], { values: ['Other City'] })
    expect(service).not.toBeCalled()
    // If it affects itself it will go through
    await tree.mutate(['root', 'agencies'], { size: 12 })
    expect(service).toBeCalledTimes(1)

    // Trigger Update should also let searches through
    await tree.mutate(['root', 'agencies'], { values: ['First City'] })
    expect(service).toBeCalledTimes(1)
    await tree.triggerUpdate()
    expect(service).toBeCalledTimes(2)
  })
  it('should not update nodes without values', async () => {
    // working here
    let service = jest.fn(mockService())
    let Tree = ContextureClient({
      service,
      debounce: 1,
      disableAutoUpdate: true,
    })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        { key: 'results', type: 'results' },
        { key: 'agencies', field: 'Organization.Name', type: 'facet' },
        { key: 'vendors', field: 'Vendor.Name', type: 'facet' },
        { key: 'dates', field: 'Date', type: 'date' },
      ],
    })

    // Don't trigger Update if there is not value
    await tree.mutate(['root', 'agencies'], { mode: 'exclude' })
    expect(service).toBeCalledTimes(0)
    await tree.mutate(['root', 'dates'], { range: 'allDates' })
    expect(service).toBeCalledTimes(0)

    // Don't trigger Update if adding node without value
    await tree.add(
      ['root'],
      {
        key: 'emptyFilter',
        type: 'facet',
        field: 'field1',
        context: {},
      },
      { index: 1 }
    )
    expect(service).toBeCalledTimes(1)
  })
  it('should allow individual nodes to be updated', async () => {
    // working here
    let service = jest.fn(mockService())
    let Tree = ContextureClient({
      service,
      debounce: 1,
      disableAutoUpdate: true,
    })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        { key: 'results', type: 'results' },
        {
          key: 'criteria',
          children: [
            { key: 'agencies', field: 'Organization.Name', type: 'facet' },
            {
              key: 'vendors',
              field: 'Vendor.Name',
              type: 'facet',
              forceFilterOnly: true,
            },
          ],
        },
      ],
    })

    // Trigger Update should let only targeted search through
    await tree.mutate(['root', 'criteria', 'agencies'], { size: 12 })
    expect(service).toBeCalledTimes(1)
    let [dto, now] = service.mock.calls[0]
    expect(dto).toEqual({
      children: [
        {
          filterOnly: true,
          key: 'results',
          page: 1,
          pageSize: 10,
          type: 'results',
          view: 'table',
        },
        {
          filterOnly: true,
          key: 'criteria',
          children: [
            {
              field: 'Organization.Name',
              key: 'agencies',
              lastUpdateTime: now,
              mode: 'include',
              optionsFilter: '',
              size: 12,
              type: 'facet',
              values: [],
            },
            {
              field: 'Vendor.Name',
              forceFilterOnly: true,
              filterOnly: true,
              key: 'vendors',
              mode: 'include',
              optionsFilter: '',
              type: 'facet',
              values: [],
            },
          ],
        },
      ],
      filterOnly: true,
      join: 'and',
      key: 'root',
    })
    // Refreshing whole tree shouldn't block searches
    await tree.dispatch({ type: 'refresh', path: ['root'] })
    expect(service).toBeCalledTimes(2)
    let [body, ts] = service.mock.calls[1]

    expect(body).toEqual({
      children: [
        {
          key: 'results',
          page: 1,
          pageSize: 10,
          type: 'results',
          view: 'table',
          lastUpdateTime: ts,
        },
        {
          key: 'criteria',
          lastUpdateTime: ts,
          children: [
            {
              field: 'Organization.Name',
              key: 'agencies',
              mode: 'include',
              optionsFilter: '',
              size: 12,
              type: 'facet',
              values: [],
              lastUpdateTime: ts,
            },
            {
              field: 'Vendor.Name',
              forceFilterOnly: true,
              filterOnly: true,
              key: 'vendors',
              mode: 'include',
              optionsFilter: '',
              type: 'facet',
              values: [],
              lastUpdateTime: ts,
            },
          ],
        },
      ],
      join: 'and',
      key: 'root',
      lastUpdateTime: ts,
    })
  })
  it('should still debounce disableAutoUpdate even with self affecting reactors that triggerImmediate', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({
      service,
      debounce: 1,
      disableAutoUpdate: true,
    })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        { key: 'filter1', type: 'tagsQuery', field: 'facetfield' },
        { key: 'results', type: 'results' },
      ],
    })
    expect(service).toBeCalledTimes(0)

    // Tags mutate has a self affecting reactor (`all`), which will triggerImmediate and bypass disableAutoUpdate
    let toTags = _.map((word) => ({ word }))
    let calls = [
      tree.mutate(['root', 'filter1'], { tags: toTags(['1']) }),
      tree.mutate(['root', 'filter1'], { tags: toTags(['1', '2']) }),
      tree.mutate(['root', 'filter1'], { tags: toTags(['1', '2', '3']) }),
      tree.mutate(['root', 'filter1'], { tags: toTags(['1', '2', '3', '4']) }),
    ]
    expect(service).toBeCalledTimes(0)

    // Even though 4 mutate calls were made, only 1 search should have actually triggered
    await Promise.all(calls)
    expect(service).toBeCalledTimes(1)
  })
  it('should call onUpdateByOthers', async () => {
    let service = jest.fn(mockService())
    let types = {
      facet: {
        reactors: { values: 'others' },
        defaults: {
          context: {
            options: [],
          },
        },
      },
      results: {
        onUpdateByOthers(node, extend) {
          extend(node, { page: 1 })
        },
      },
    }
    let Tree = ContextureClient({ debounce: 1, service, types })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'results',
          type: 'results',
          page: 2,
        },
        {
          key: 'agencies',
          field: 'Organization.Name',
          type: 'facet',
        },
        {
          key: 'vendors',
          field: 'Vendor.Name',
          type: 'facet',
        },
      ],
    })
    await tree.mutate(['root', 'agencies'], { values: ['Other City'] })
    expect(tree.getNode(['root', 'results']).page).toBe(1)
    expect(service).toBeCalledTimes(1)
  })
  it('onUpdateByOthers should not block on self update', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'results',
          type: 'results',
          page: 1,
        },
        {
          key: 'agencies',
          field: 'Organization.Name',
          type: 'facet',
        },
        {
          key: 'vendors',
          field: 'Vendor.Name',
          type: 'facet',
        },
      ],
    })
    await tree.mutate(['root', 'results'], { page: 2 })
    expect(tree.getNode(['root', 'results']).page).toBe(2)
    expect(service).toBeCalledTimes(1)
  })
  it('should support add at index', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'results',
          type: 'results',
          page: 1,
        },
        {
          key: 'analytics',
          type: 'results',
          page: 1,
        },
      ],
    })
    await tree.add(
      ['root'],
      {
        key: 'filter1',
        type: 'facet',
        field: 'field1',
      },
      { index: 1 }
    )

    let keys = _.map('key', tree.tree.children)
    expect(keys).toEqual(['results', 'filter1', 'analytics'])
  })
  it('should support add with children', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'results',
          type: 'results',
          page: 1,
        },
      ],
    })
    await tree.add(['root'], {
      key: 'criteria',
      children: [
        {
          key: 'filter1',
          type: 'facet',
          field: 'field1',
        },
        {
          key: 'filter2',
          type: 'facet',
          field: 'field2',
        },
      ],
    })
    let filter1Get = tree.getNode(['root', 'criteria', 'filter1'])
    let filter1Direct = tree.getNode(['root', 'criteria']).children[0]
    expect(filter1Direct).toBeDefined()
    expect(toJS(filter1Direct.path)).toEqual(['root', 'criteria', 'filter1'])
    expect(filter1Get).toBe(filter1Direct)

    // Check initNode worked and added default props
    expect(filter1Get.values).toEqual([])
    expect(toJS(filter1Get.path)).toEqual(['root', 'criteria', 'filter1'])

    // "move" to another node location and make sure everything is updated
    await tree.mutate(['root', 'criteria', 'filter1'], { values: [1, 2, 3] })
    await tree.remove(['root', 'criteria', 'filter1'])
    expect(tree.getNode(['root', 'criteria', 'filter1'])).not.toBeDefined()
    expect(filter1Direct).toBeDefined()
    await tree.add(['root'], filter1Direct)

    let newlyAddedNode = tree.getNode(['root', 'filter1'])
    expect(newlyAddedNode).toBeDefined()
    expect(toJS(newlyAddedNode.path)).toEqual(['root', 'filter1'])
    expect(toJS(newlyAddedNode.values)).toEqual([1, 2, 3])
  })
  it('should remove children from flat array', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'results',
          type: 'results',
          page: 1,
        },
        {
          key: 'criteria',
          children: [
            {
              key: 'filter1',
              type: 'facet',
              field: 'field1',
            },
            {
              key: 'filter2',
              type: 'facet',
              field: 'field2',
            },
          ],
        },
      ],
    })
    await tree.remove(['root', 'criteria'])
    expect(tree.getNode(['root', 'criteria'])).not.toBeDefined()
    expect(tree.getNode(['root', 'criteria', 'filter1'])).not.toBeDefined()
  })
  it('should replace', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'results',
          type: 'results',
          page: 1,
        },
        {
          key: 'criteria',
          children: [
            {
              key: 'filter1',
              type: 'facet',
              field: 'field1',
            },
            {
              key: 'filter2',
              type: 'facet',
              field: 'field2',
            },
          ],
        },
      ],
    })
    expect(tree.tree.children[1].key).toEqual('criteria')
    // Replace with a transform
    await tree.replace(['root', 'criteria'], (node) => ({
      ...node,
      key: 'criteria1',
      values: [1, 2, 3],
    }))
    expect(tree.getNode(['root', 'criteria'])).not.toBeDefined()
    expect(toJS(tree.getNode(['root', 'criteria1']).values)).toEqual([1, 2, 3])
    expect(tree.getNode(['root', 'criteria1']).children).toHaveLength(2)
    // Confirm it's at the right index
    expect(tree.tree.children[1].key).toEqual('criteria1')
    // Replace with a new object
    await tree.replace(['root', 'criteria1'], () => ({
      key: 'criteria2',
      type: 'facet',
    }))
    expect(tree.getNode(['root', 'criteria'])).not.toBeDefined()
    expect(toJS(tree.getNode(['root', 'criteria2']).values)).toEqual([])
    expect(tree.getNode(['root', 'criteria2']).children).not.toBeDefined()
    expect(tree.tree.children[1].key).toEqual('criteria2')
  })
  it('should clear', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'results',
          type: 'results',
          page: 1,
        },
        {
          key: 'criteria',
          children: [
            {
              key: 'filter1',
              type: 'tagsQuery',
              field: 'field1',
              defaults: {
                join: 'none',
                tags: [],
              },
            },
            {
              key: 'filter2',
              type: 'tagsQuery',
              field: 'field2',
            },
          ],
        },
      ],
    })
    await tree.mutate(['root', 'criteria', 'filter1'], {
      tags: [{ word: 'abc', distance: 3 }],
    })
    await tree.mutate(['root', 'criteria', 'filter2'], {
      tags: [{ word: 'opa', distance: 3 }],
    })

    tree.clear(['root', 'criteria', 'filter1'])
    tree.clear(['root', 'criteria', 'filter2'])

    expect(tree.getNode(['root', 'criteria', 'filter1']).tags).toEqual([])
    expect(tree.getNode(['root', 'criteria', 'filter2']).tags).toEqual([])

    expect(tree.getNode(['root', 'criteria', 'filter1']).join).toBe('none')
    expect(tree.getNode(['root', 'criteria', 'filter2']).join).toBe('any')
  })
  it('should wrapInGroup replace', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'results',
          type: 'results',
          page: 1,
        },
        {
          key: 'criteria',
          children: [
            {
              key: 'filter1',
              type: 'facet',
              field: 'field1',
            },
            {
              key: 'filter2',
              type: 'facet',
              field: 'field2',
            },
          ],
        },
      ],
    })
    tree.addActions((config) => wrap(config, tree))
    await tree.wrapInGroupReplace(['root', 'results'], {
      key: 'analytics',
      join: 'and',
    })

    expect(tree.getNode(['root', 'analytics'])).toBeDefined()
    expect(tree.getNode(['root', 'results'])).not.toBeDefined()
    expect(tree.getNode(['root', 'analytics', 'results'])).toBeDefined()
  })
  it('should wrapInGroup root', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        { key: 'results', type: 'results', page: 1 },
        {
          key: 'criteria',
          children: [
            { key: 'filter1', type: 'facet', field: 'field1' },
            { key: 'filter2', type: 'facet', field: 'field2' },
          ],
        },
      ],
    })
    tree.addActions((config) => wrap(config, tree))
    await tree.wrapInGroupInPlace(['root'], { key: 'newRootChild', join: 'or' })

    expect(tree.getNode(['newRootChild'])).toBeDefined()
    expect(tree.getNode(['newRootChild']).join).toBe('or')
    expect(tree.getNode(['newRootChild', 'root'])).toBeDefined()
    expect(tree.getNode(['newRootChild', 'root', 'results'])).toBeDefined()
    expect(
      toJS(tree.getNode(['newRootChild', 'root', 'criteria']).path)
    ).toEqual(['newRootChild', 'root', 'criteria'])
  })
  it('should wrapInGroup', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        { key: 'results', type: 'results', page: 1 },
        {
          key: 'criteria',
          children: [
            { key: 'filter1', type: 'facet', field: 'field1' },
            { key: 'filter2', type: 'facet', field: 'field2' },
          ],
        },
      ],
    })
    tree.addActions((config) => wrap(config, tree))
    await tree.wrapInGroup(['root', 'results'], {
      key: 'analytics',
      join: 'and',
    })

    expect(tree.getNode(['root', 'analytics'])).toBeDefined()
    expect(tree.getNode(['root', 'results'])).not.toBeDefined()
    expect(tree.getNode(['root', 'analytics', 'results'])).toBeDefined()

    await tree.wrapInGroupInPlace(['root'], { key: 'newRootChild', join: 'or' })

    expect(tree.getNode(['newRootChild'])).toBeDefined()
    expect(tree.getNode(['newRootChild']).join).toBe('or')
    expect(tree.getNode(['newRootChild', 'root'])).toBeDefined()
    expect(
      tree.getNode(['newRootChild', 'root', 'analytics', 'results'])
    ).toBeDefined()
    expect(
      toJS(tree.getNode(['newRootChild', 'root', 'criteria']).path)
    ).toEqual(['newRootChild', 'root', 'criteria'])
  })
  it('should move', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        { key: 'results', type: 'results', page: 1 },
        {
          key: 'criteria',
          children: [
            { key: 'filter1', type: 'facet', field: 'field1', values: [1, 2] },
            { key: 'filter2', type: 'facet', field: 'field2' },
          ],
        },
      ],
    })
    expect(tree.getNode(['root', 'criteria']).children[0].key).toBe('filter1')
    expect(tree.getNode(['root', 'criteria']).children[1].key).toBe('filter2')

    await tree.move(['root', 'criteria', 'filter1'], { index: 1 })
    expect(tree.getNode(['root', 'criteria']).children[0].key).toBe('filter2')
    expect(tree.getNode(['root', 'criteria']).children[1].key).toBe('filter1')
    expect(service).not.toBeCalled()

    await tree.move(['root', 'criteria', 'filter1'], { path: ['root'] })
    expect(tree.getNode(['root', 'criteria', 'filter1'])).not.toBeDefined()
    expect(tree.getNode(['root', 'filter1'])).toBeDefined()
    expect(service).toBeCalledTimes(1)
  })
  it('should support pause actions', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        { key: 'results', type: 'results', page: 1 },
        {
          key: 'criteria',
          children: [
            { key: 'filter1', type: 'facet', field: 'field1', values: [1, 2] },
            { key: 'filter2', type: 'facet', field: 'field2' },
          ],
        },
      ],
    })
    expect(tree.isPausedNested(['root', 'criteria'])).toBe(false)
    expect(tree.getNode(['root', 'criteria', 'filter1']).paused).not.toBe(true)
    expect(tree.getNode(['root', 'criteria', 'filter2']).paused).not.toBe(true)
    await tree.pauseNested(['root', 'criteria'])
    expect(tree.isPausedNested(['root', 'criteria'])).toBe(true)
    expect(tree.getNode(['root', 'criteria', 'filter1']).paused).toBe(true)
    expect(tree.getNode(['root', 'criteria', 'filter2']).paused).toBe(true)
    await tree.unpauseNested(['root', 'criteria'])
    expect(tree.isPausedNested(['root', 'criteria'])).toBe(false)
    expect(tree.getNode(['root', 'criteria', 'filter1']).paused).toBe(false)
    expect(tree.getNode(['root', 'criteria', 'filter2']).paused).toBe(false)
  })
  it('should autogenerate keys on node add', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        { key: 'results', type: 'results', page: 1 },
        {
          key: 'criteria',
          children: [
            {
              key: 'field-facet',
              type: 'facet',
              field: 'field',
              values: [1, 2],
            },
            { key: 'field-facet1', type: 'facet', field: 'field' },
          ],
        },
      ],
    })
    expect(tree.getNode(['root', 'criteria', 'field-facet2'])).not.toBeDefined()
    // should dedupe added nodes against existing siblings
    await tree.add(['root', 'criteria'], { type: 'facet', field: 'field' })
    expect(tree.getNode(['root', 'criteria', 'field-facet2'])).toBeDefined()
    // should autokey nested nodes
    await tree.add(['root'], {
      type: 'group',
      children: [
        {
          type: 'date',
          field: 'birthday',
        },
      ],
    })
    expect(tree.getNode(['root', 'group', 'birthday-date'])).toBeDefined()
    // should still dedupe nodes with user-created keys
    await tree.add(['root', 'group'], { key: 'birthday-date' })
    expect(tree.getNode(['root', 'group', 'birthday-date1'])).toBeDefined()
    // should use the type-config autokey if one exists (as it does for terms_stats)
    await tree.add(['root'], {
      type: 'terms_stats',
      key_field: 'holland',
      value_field: 'oats',
    })
    expect(tree.getNode(['root', 'holland-oats-terms_stats'])).toBeDefined()
  })
  it('should autogenerate keys on tree initialization', () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({ debounce: 1, service })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        { type: 'results', page: 1 },
        {
          key: 'criteria',
          children: [
            { type: 'facet', field: 'field', values: [1, 2] },
            { type: 'facet', field: 'field', values: [3, 4] },
            {
              type: 'group',
              // should autokey nested nodes
              children: [
                {
                  type: 'query',
                  field: 'pizza',
                },
                {
                  // should not dedupe non-siblings
                  type: 'group',
                  children: [
                    // should autokey blank nodes
                    {},
                    {},
                    // should still dedupe nodes with user-created keys
                    { key: 'node1' },
                    { key: 'node' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
    expect(tree.getNode(['root', 'criteria', 'field-facet'])).toBeDefined()
    expect(tree.getNode(['root', 'criteria', 'field-facet1'])).toBeDefined()
    expect(
      tree.getNode(['root', 'criteria', 'group', 'pizza-query'])
    ).toBeDefined()
    expect(
      _.map(
        'key',
        tree.getNode(['root', 'criteria', 'group', 'group']).children
      )
    ).toEqual(['node', 'node1', 'node11', 'node2'])
  })
  it('should have debugInfo', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient({
      debounce: 1,
      service,
      debug: true,
      log() {},
    })
    let tree = Tree({
      key: 'root',
      join: 'and',
      children: [
        { type: 'results', page: 1 },
        {
          key: 'filter',
          type: 'facet',
        },
      ],
    })
    expect(tree.debugInfo.dispatchHistory).toEqual([])
    await tree.mutate(['root', 'filter'], {
      values: ['a'],
    })
    let dispatchRecord = tree.debugInfo.dispatchHistory[0]
    expect(dispatchRecord.node).toBeDefined()
    expect(dispatchRecord.type).toBe('mutate')
    expect(toJS(dispatchRecord.path)).toEqual(['root', 'filter'])
  })
  it('should have metaHistory', async () => {
    let mocks = ({ type }) =>
      ({
        results: {
          context: {
            count: 1,
            results: [
              {
                title: 'some OTHER result',
              },
            ],
          },
          _meta: {
            requests: [
              {
                request: { body: {}, headers: {} },
                response: {
                  took: 39,
                  timed_out: false,
                  _shards: {
                    total: 1,
                    successful: 1,
                    skipped: 0,
                    failed: 0,
                  },
                  hits: {
                    total: 1,
                    max_score: 0,
                    hits: [
                      {
                        _source: {
                          title: 'some result',
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      }[type])
    let service = mockService({ mocks })
    let TreeJustForthisTest = ContextureClient({
      debounce: 1,
      service,
      debug: true,
      log() {},
    })
    let tree = TreeJustForthisTest({
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'filter',
          type: 'facet',
        },
        { type: 'results', page: 1 },
      ],
    })
    expect(tree.debugInfo.dispatchHistory).toEqual([])
    await tree.mutate(['root', 'filter'], {
      values: ['a'],
    })
    let resultsNode = tree.getNode(['root', 'results'])
    expect(resultsNode.metaHistory).toBeDefined()
    expect(resultsNode.metaHistory[0].requests[0].response.hits.total).toBe(1)
  })
  it('should support processResponseNode', () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient(
      { service, debounce: 1 },
      {
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'analysis',
            join: 'and',
            children: [
              {
                key: 'results',
                type: 'results',
              },
            ],
          },
        ],
      }
    )
    expect(Tree.tree.children[0].children[0].hasResults).toBe(null)

    Tree.processResponseNode(['root', 'analysis', 'results'], {
      context: { response: { totalRecords: 1337 } },
    })

    expect(Tree.tree.children[0].children[0].hasResults).toBe(true)
    expect(
      Tree.tree.children[0].children[0].context.response.totalRecords
    ).toBe(1337)
    expect(service).toBeCalledTimes(0)
  })
  it('should support response merges', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient(
      { service, debounce: 1 },
      {
        key: 'root',
        join: 'and',
        children: [
          { key: 'results', type: 'results', infiniteScroll: true },
          { key: 'test', type: 'facet', values: [] },
        ],
      }
    )

    // Simulating infinite scroll, page 1 and 2 are combined
    await Tree.mutate(['root', 'results'], { page: 1 }) // returns 1 record
    await Tree.mutate(['root', 'results'], { page: 2 }) // returns 1 record
    expect(toJS(Tree.tree.children[0].context.results)).toEqual([
      { title: 'some result' },
      { title: 'some result' },
    ])

    // update by others forces response replace instead of merge
    await Tree.mutate(['root', 'test'], { values: ['asdf'] })
    expect(toJS(Tree.tree.children[0].context.results)).toEqual([
      { title: 'some result' },
    ])
  })
  it('should support key based pivot response merges', async () => {
    let service = jest.fn(mockService())
    let rows = [
      { type: 'fieldValuesPartition', field: 'State', matchValue: 'Florida' },
      { type: 'fieldValues', field: 'City', size: 10 },
    ]
    let Tree = ContextureClient(
      { service, debounce: 1 },
      {
        key: 'root',
        join: 'and',
        children: [
          { key: 'pivot', type: 'pivot', rows },
          { key: 'test', type: 'facet', values: [] },
        ],
      }
    )
    let node = Tree.getNode(['root', 'pivot'])

    // TODO test the loaded field population
    let merge = (results) =>
      exampleTypes.pivot.mergeResponse(
        node,
        { context: { results } },
        Tree.extend,
        Tree.snapshot
      )
    merge({
      rows: [
        { key: 'FL', rows: [{ key: 'fl1', a: 1 }] },
        { key: 'NV', rows: [{ key: 'nv1', a: 1 }] },
      ],
    })
    merge({
      rows: [
        {
          key: 'NV',
          rows: [
            { key: 'nv2', b: 1 },
            { key: 'nv1', a: 2 },
          ],
        },
      ],
    })

    expect(toJS(node.context.results)).toEqual({
      rows: [
        { key: 'FL', rows: [{ key: 'fl1', a: 1 }] },
        {
          key: 'NV',
          rows: [
            { key: 'nv1', a: 2 },
            { key: 'nv2', b: 1 },
          ],
        },
      ],
    })
  })
  it('should merge pivot response with nested rows and columns', async () => {
    let service = jest.fn(mockService())
    let columns = [{ type: 'dateInterval', field: 'Date', interval: 'year' }]
    let rows = [
      { type: 'fieldValuesPartition', field: 'State', matchValue: 'Florida' },
      { type: 'fieldValues', field: 'City', size: 10 },
      { type: 'fieldValues', field: 'Name', size: 10 },
    ]
    let Tree = ContextureClient(
      { service, debounce: 1 },
      {
        key: 'root',
        join: 'and',
        children: [
          { key: 'pivot', type: 'pivot', columns, rows },
          { key: 'test', type: 'facet', values: [] },
        ],
      }
    )
    let node = Tree.getNode(['root', 'pivot'])

    // TODO test the loaded field population
    let merge = (results) =>
      exampleTypes.pivot.mergeResponse(
        node,
        { context: { results } },
        Tree.extend,
        Tree.snapshot
      )
    merge({
      rows: [
        {
          key: 'FL',
          columns: [
            { key: '2021', a: 3 },
            { key: '2022', a: 4 },
          ],
          rows: [],
        },
        {
          key: 'NV',
          columns: [
            { key: '2021', a: 6 },
            { key: '2022', a: 8 },
          ],
          rows: [],
        },
      ],
    })
    merge({
      rows: [
        {
          key: 'FL',
          columns: [
            { key: '2021', a: 3 },
            { key: '2022', a: 4 },
          ],
          rows: [
            {
              key: 'Miami',
              columns: [
                { key: '2021', a: 2 },
                { key: '2022', a: 3 },
              ],
              rows: [],
            },
            {
              key: 'Hollywood',
              columns: [
                { key: '2021', a: 1 },
                { key: '2022', a: 1 },
              ],
              rows: [],
            },
          ],
        },
      ],
    })
    merge({
      rows: [
        {
          key: 'FL',
          columns: [
            { key: '2021', a: 3 },
            { key: '2022', a: 4 },
          ],
          rows: [
            {
              key: 'Miami',
              columns: [
                { key: '2021', a: 2 },
                { key: '2022', a: 3 },
              ],
              rows: [
                {
                  key: 'NanoSoft',
                  columns: [
                    { key: '2021', a: 1 },
                    { key: '2022', a: 2 },
                  ],
                },
                {
                  key: 'MicroHard',
                  columns: [
                    { key: '2021', a: 1 },
                    { key: '2022', a: 1 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })

    expect(toJS(node.context.results)).toEqual({
      rows: [
        {
          key: 'FL',
          columns: [
            { key: '2021', a: 3 },
            { key: '2022', a: 4 },
          ],
          rows: [
            {
              key: 'Miami',
              columns: [
                { key: '2021', a: 2 },
                { key: '2022', a: 3 },
              ],
              rows: [
                {
                  key: 'NanoSoft',
                  columns: [
                    { key: '2021', a: 1 },
                    { key: '2022', a: 2 },
                  ],
                },
                {
                  key: 'MicroHard',
                  columns: [
                    { key: '2021', a: 1 },
                    { key: '2022', a: 1 },
                  ],
                },
              ],
            },
            {
              key: 'Hollywood',
              columns: [
                { key: '2021', a: 1 },
                { key: '2022', a: 1 },
              ],
              rows: [],
            },
          ],
        },
        {
          key: 'NV',
          columns: [
            { key: '2021', a: 6 },
            { key: '2022', a: 8 },
          ],
          rows: [],
        },
      ],
    })
  })
  it('should support onDispatch (and pivot resetting drilldown)', async () => {
    let service = jest.fn(mockService())
    let rows = [
      { type: 'fieldValuesPartition', field: 'State', matchValue: 'Florida' },
      { type: 'fieldValues', field: 'City', size: 10 },
    ]
    let Tree = ContextureClient(
      { service, debounce: 1 },
      {
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'pivot',
            type: 'pivot',
            expansions: [],
            rows,
          },
          { key: 'test', type: 'facet', values: [] },
        ],
      }
    )

    let node = Tree.getNode(['root', 'pivot'])

    node.expand(Tree, ['root', 'pivot'], 'rows', ['Florida'])

    // Changing only fields from the skip field list shouldn't reset expansions
    let currentSkipFieldValues = _.pick(skipResetExpansionsFields, node)
    Tree.mutate(
      ['root', 'pivot'],
      F.arrayToObject(
        (x) => x,
        () => true,
        skipResetExpansionsFields
      )
    )
    Tree.mutate(['root', 'pivot'], currentSkipFieldValues)
    expect(toJS(Tree.getNode(['root', 'pivot']).expansions)).toEqual([
      {
        drilldown: [],
        loaded: [],
        type: 'columns',
      },
      {
        drilldown: [],
        loaded: [],
        type: 'rows',
      },
      {
        drilldown: ['Florida'],
        loaded: false,
        type: 'rows',
      },
    ])

    // Changing fieldValuesPartition matchValue does force replace
    Tree.mutate(['root', 'pivot'], {
      rows: _.set('0.matchValue', 'Nevada', rows),
    })
    expect(Tree.getNode(['root', 'pivot']).expansions).toEqual([])
  })
  it('should preserve expanded drilldowns when drilling and paginating', async () => {
    let service = jest.fn(mockService())
    let rows = [
      { type: 'fieldValuesPartition', field: 'State' },
      { type: 'fieldValues', field: 'City', size: 10 },
    ]
    let Tree = ContextureClient(
      { service, debounce: 1 },
      {
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'pivot',
            type: 'pivot',
            expansions: [],
            rows,
          },
          { key: 'test', type: 'facet', values: [] },
        ],
      }
    )

    Tree.processResponseNode(['root', 'pivot'], {
      context: {
        results: {
          rows: [
            { key: 'Florida', rows: [{ key: 'Miami', a: 1 }] },
            {
              key: 'Nevada',
              rows: [{ key: 'Las Vegas', a: 2 }],
            },
          ],
        },
      },
    })

    let node = Tree.getNode(['root', 'pivot'])
    node.expand(Tree, ['root', 'pivot'], 'rows', ['Florida'])

    expect(toJS(Tree.getNode(['root', 'pivot']).expansions)).toEqual([
      { type: 'columns', drilldown: [], loaded: [] },
      { type: 'rows', drilldown: [], loaded: ['Florida', 'Nevada'] },
      { type: 'rows', drilldown: ['Florida'], loaded: false },
    ])
  })
  it('should preserve expanded columns when changing sort configuration', async () => {
    let service = jest.fn(mockService())
    let columns = [
      { type: 'fieldValuesPartition', field: 'State' },
      { type: 'fieldValues', field: 'City', size: 10 },
    ]
    let rows = [{ type: 'fieldValues', field: 'Name', size: 10 }]
    let Tree = ContextureClient(
      { service, debounce: 1 },
      {
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'pivot',
            type: 'pivot',
            expansions: [],
            columns,
            rows,
            sort: {
              columnValues: [],
              valueIndex: 0,
            },
          },
          { key: 'test', type: 'facet', values: [] },
        ],
      }
    )

    Tree.mutate(['root', 'pivot'], {
      context: {
        results: {
          columns: [
            { key: 'Florida', columns: [{ key: 'Miami', a: 1 }] },
            {
              key: 'Nevada',
              columns: [{ key: 'Las Vegas', a: 2 }],
            },
          ],
          rows: [
            {
              key: 'NanoSoft',
              columns: [
                { key: 'Florida', columns: [{ key: 'Miami', a: 1 }] },
                {
                  key: 'Nevada',
                  columns: [{ key: 'Las Vegas', a: 2 }],
                },
              ],
            },
          ],
        },
      },
    })

    let node = Tree.getNode(['root', 'pivot'])

    node.expand(Tree, ['root', 'pivot'], 'rows', ['NanoSoft'])
    node.expand(Tree, ['root', 'pivot'], 'columns', ['Florida'])

    Tree.mutate(['root', 'pivot'], {
      sort: {
        columnValues: ['Florida', 'Miami'],
        valueIndex: 0,
      },
    })

    expect(toJS(Tree.getNode(['root', 'pivot']).expansions)).toEqual([
      {
        drilldown: [],
        loaded: false,
        type: 'columns',
      },
      { drilldown: ['Florida'], loaded: false, type: 'columns' },
    ])
  })
  it('should support watchNode', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient(
      { service, debounce: 1 },
      {
        key: 'root',
        join: 'and',
        children: [
          { key: 'results', type: 'results', infiniteScroll: true },
          { key: 'test', type: 'facet', values: [] },
        ],
      }
    )
    let resultWatcher = jest.fn()
    Tree.watchNode(['root', 'results'], resultWatcher, ['page', 'context'])
    let facetWatcher = jest.fn()
    Tree.watchNode(['root', 'test'], facetWatcher, ['values'])

    let promise = Tree.mutate(['root', 'results'], { page: 1 })
    expect(resultWatcher).toBeCalledTimes(1)
    await promise
    expect(resultWatcher).toBeCalledTimes(2)
    await Tree.mutate(['root', 'results'], { page: 2 })
    expect(resultWatcher).toBeCalledTimes(4)

    await Tree.mutate(['root', 'test'], { values: ['asdf'] })
    expect(facetWatcher).toBeCalledTimes(1)
    // resultWatcher called twice more because facet change resets page to 0
    expect(resultWatcher).toBeCalledTimes(6)
  })
  it('should getNode', async () => {
    let service = jest.fn(mockService())
    let Tree = ContextureClient(
      { service, debounce: 1 },
      {
        key: 'root',
        join: 'and',
        children: [
          { key: 'results', type: 'results', infiniteScroll: true },
          { key: 'test', type: 'facet', values: [] },
        ],
      }
    )
    let result = Tree.getNode(['root', 'results'])
    expect(result.infiniteScroll).toBe(true)
  })
  it('should support group level markedForUpdate', async () => {
    let service = jest.fn(mockService({ delay: 10 }))
    let tree = ContextureClient(
      { service, debounce: 1 },
      {
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'filter',
            type: 'facet',
            field: 'facetfield',
            values: ['some value'],
          },
          { key: 'results', type: 'results' },
        ],
      }
    )
    let action = tree.mutate(['root', 'filter'], { values: ['other Value'] })

    // Before async validate runs on dispatch ( and thus before marking for update)
    expect(!!tree.getNode(['root', 'results']).isStale).toBe(false)
    expect(!!tree.getNode(['root']).isStale).toBe(false)

    // Preparing to search (0 ms delay because validate is async)
    await Promise.delay()
    expect(tree.getNode(['root', 'results']).isStale).toBe(true)
    expect(tree.getNode(['root']).markedForUpdate).toBe(true)
    expect(tree.getNode(['root']).isStale).toBe(true)
    expect(!!tree.getNode(['root']).updating).toBe(false)

    // Prepare for search, but run before search finishes
    /// TODOOO HERE:::: unpredicable fail - could be timing issue???
    await Promise.delay(5)
    expect(tree.getNode(['root']).markedForUpdate).toBe(false)
    expect(tree.getNode(['root']).isStale).toBe(true)
    expect(tree.getNode(['root']).updating).toBe(true)

    // After search finishes
    await action
    expect(tree.getNode(['root']).markedForUpdate).toBe(false)
    expect(tree.getNode(['root']).isStale).toBe(false)
    expect(tree.getNode(['root']).updating).toBe(false)
  })
  it('should support group level markedForUpdate and reset when children are done in disableAutoUpdateMode', async () => {
    let service = jest.fn(mockService({ delay: 10 }))
    let tree = ContextureClient(
      { service, debounce: 1, disableAutoUpdate: true },
      {
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'criteria',
            join: 'and',
            type: 'group',
            children: [
              {
                key: 'bar',
                type: 'tagsQuery',
                field: 'FieldGroup.all',
              },
              {
                key: 'filters',
                join: 'and',
                type: 'group',
                children: [
                  {
                    key: 'filter',
                    type: 'facet',
                    field: 'facetfield',
                    values: ['some value'],
                  },
                  {
                    key: 'filter2',
                    type: 'facet',
                    field: 'facetfield2',
                    values: ['some other value'],
                    paused: true,
                  },
                ],
              },
            ],
          },
          { key: 'results', type: 'results' },
        ],
      }
    )

    let action = tree.mutate(['root', 'results'], { page: 2 })
    // Preparing to search (0 ms delay because validate is async)
    await Promise.delay()
    // await action
    expect(tree.getNode(['root']).markedForUpdate).toBe(true)
    expect(tree.getNode(['root']).isStale).toBe(true)
    await Promise.delay(1)
    expect(tree.getNode(['root']).markedForUpdate).toBe(false)
    expect(tree.getNode(['root']).updating).toBe(true)
    expect(tree.getNode(['root']).isStale).toBe(true)
    await action
    expect(tree.getNode(['root']).markedForUpdate).toBe(false)
    expect(tree.getNode(['root']).updating).toBe(false)
    expect(tree.getNode(['root']).isStale).toBe(false)
  })
}

describe('lib', () => AllTests(ContextureClient))
describe('mobx', () => AllTests(ContextureMobx))
