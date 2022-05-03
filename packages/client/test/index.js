import _ from 'lodash/fp'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import ContextureClient, { encode, exampleTypes } from '../src'
import Promise from 'bluebird'
import mockService from '../src/mockService'
import wrap from '../src/actions/wrap'
import { observable, toJS, set } from 'mobx'
const expect = chai.expect
chai.use(sinonChai)

let mobxAdapter = { snapshot: toJS, extend: set, initObject: observable }
let ContextureMobx = _.curry((x, y) =>
  ContextureClient({ ...mobxAdapter, ...x })(y)
)

let addDelay = (delay, fn) => async (...args) => {
  await Promise.delay(delay)
  return fn(...args)
}

let AllTests = ContextureClient => {
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
    let service = sinon.spy(mockService())
    let Tree = ContextureClient({ service, debounce: 1 }, tree)
    it('should generally mutate', async () => {
      await Tree.mutate(['root', 'filter'], {
        values: ['a'],
      })
      expect(service).to.have.callCount(1)
      let [dto, now] = service.getCall(0).args
      expect(dto).to.deep.equal({
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
          },
        ],
      })
    })
    it('should update contexts', () => {
      expect(Tree.getNode(['root', 'results']).updating).to.be.false
      expect(Tree.getNode(['root', 'results']).context).to.deep.equal({
        count: 1,
        results: [
          {
            title: 'some result',
          },
        ],
      })
    })
    it('should serialize cleanly', () => {
      expect(Tree.serialize()).to.deep.equal({
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
          },
        ],
      })
    })
    it('should not block blank searches', async () => {
      service.resetHistory()
      await Tree.mutate(['root', 'filter'], {
        values: [],
      })
      expect(service).to.have.callCount(1)
    })
    it('should not search if nothing needs updating', async () => {
      service.resetHistory()
      expect(service).to.have.callCount(0)
      await Tree.dispatch({
        path: ['root'],
        type: 'notAType',
      })
      expect(service).to.have.callCount(0)
    })
    // it('should not dispatch if there is no mutation')
    it('should handle join changes', async () => {
      service.resetHistory()
      expect(service).to.have.callCount(0)
      Tree.getNode(['root', 'filter']).values = ['real val']
      await Tree.mutate(['root'], {
        join: 'or',
      })
      expect(service).to.have.callCount(0)
      await Tree.mutate(['root'], {
        join: 'not',
      })
      expect(service).to.have.callCount(1)
      // let [dto] = service.getCall(0).args
      // console.log('call', dto)
    })
    it('should support add', async () => {
      service.resetHistory()
      await Tree.add(['root'], {
        key: 'newFilter',
        type: 'text',
      })
      expect(service).to.have.callCount(0)
      await Tree.add(['root'], {
        key: 'newFilterWithValue',
        type: 'text',
        value: 'asdf',
      })
      expect(service).to.have.callCount(1)
    })
    it('should support remove', async () => {
      service.resetHistory()
      await Tree.add(['root'], {
        key: 'newEmptyFilter',
        type: 'text',
      })
      expect(service).to.have.callCount(0)
      expect(Tree.getNode(['root', 'newEmptyFilter'])).to.exist
      await Tree.remove(['root', 'newEmptyFilter'])
      expect(service).to.have.callCount(0)
      expect(Tree.getNode(['root', 'newEmptyFilter'])).to.not.exist

      await Tree.add(['root'], {
        key: 'newFilterWithValueForRemoveTest',
        type: 'facet',
        values: 'asdf',
      })
      expect(service).to.have.callCount(1)
      expect(Tree.getNode(['root', 'newFilterWithValueForRemoveTest'])).to.exist
      await Tree.remove(['root', 'newFilterWithValueForRemoveTest'])
      expect(Tree.getNode(['root', 'newFilterWithValueForRemoveTest'])).to.not
        .exist
      expect(service).to.have.callCount(2)
    })
    it('should support refresh', async () => {
      service.resetHistory()
      await Tree.refresh(['root'])
      expect(service).to.have.callCount(1)
    })
    it('should support field changes')
    it('should probably support type changes ¯\\_(ツ)_/¯')

    it('should (un)pause', async () => {
      service.resetHistory()
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
      expect(service).to.have.callCount(0)
      expect(Tree.getNode(['root', 'filter']).paused).to.be.true
      expect(Tree.getNode(['root', 'filter']).missedUpdate).to.be.true
      // Unpause here should trigger this to run
      await Tree.mutate(['root', 'filter'], {
        paused: false,
      })
      expect(service).to.have.callCount(1)
      expect(Tree.getNode(['root', 'filter']).paused).to.be.false
      expect(Tree.getNode(['root', 'filter']).missedUpdate).to.be.false
    })
    it('should handle groups being paused')
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
      expect(e.message).to.equal('No update service provided!')
      return
    }
    throw Error('Should have thrown')
  })
  it('should work', async () => {
    let service = sinon.spy(mockService())
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
    expect(service).to.have.callCount(1)
    let [dto, now] = service.getCall(0).args
    expect(dto).to.deep.equal({
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
    let service = sinon.spy(async (dto, lastUpdateTime) => {
      let testChange = dto.children[0].values[0]
      // arbitrarily delay the first call to trigger a stale update
      await Promise.delay(testChange === 'a' ? 20 : 1)
      return mockService()(dto, lastUpdateTime)
    })

    let spy = sinon.spy()
    // Just call the spy for `results`
    let onResult = path => _.isEqual(path, ['root', 'results']) && spy()
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
    // Give it enough time for the core to trigger a search for step 1 (but not awaiting step1 because that would also wait for the service)
    await Promise.delay(10)
    let step2 = Tree.mutate(['root', 'filter'], {
      values: ['b'],
    })
    await Promise.all([step1, step2])
    expect(spy).to.have.callCount(1)
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
    let service = sinon.spy(async () => {
      throw 'service error!'
    })

    let spy = sinon.spy()
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
    expect(spy).to.have.callCount(1)
  })
  it('onError tree should be back to normal - no updating flags etc', async () => {
    let service = sinon.spy(async () => {
      throw 'service error!'
    })
    let spy = sinon.spy()
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
    expect(spy).to.have.callCount(1)
    let node = tree.getNode(['root', 'b'])
    expect(node.updating).to.be.false
    await node.updatingPromise
    expect(node.updating).to.be.false
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
    let service = sinon.spy(async () => {
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
      expect(e).to.equal('service error!')
    }
  })
  it('should support custom type reactors', async () => {
    let service = sinon.spy(mockService())
    let resultsUpdated = sinon.spy()
    let filterUpdated = sinon.spy()
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
    expect(service).to.have.callCount(1)
    expect(resultsUpdated).to.have.callCount(1)
    expect(filterUpdated).to.have.callCount(0)
    await Tree.mutate(['root', 'filter'], {
      optionType: 2,
    })
    expect(service).to.have.callCount(2)
    expect(resultsUpdated).to.have.callCount(1)
    expect(filterUpdated).to.have.callCount(1)
  })
  it('should support custom type initializers', async () => {
    let testInit = sinon.spy((node, extend) =>
      extend(node, { isExtended: true })
    )
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
    expect(testInit).to.have.callCount(1)
    expect(Tree.getNode(['root', 'filter']).isExtended).to.be.true
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
    expect(Tree.getNode(['root', 'filter']).isExtended).to.be.true
    expect(Tree.getNode(['root', 'filter']).context.example).to.equal(0)
  })
  it('should custom type reactors should work with and without values, and nested', async () => {
    let service = sinon.spy(mockService({}))
    let resultsUpdated = sinon.spy()
    let filterUpdated = sinon.spy()
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
    expect(service).to.have.callCount(1)
    expect(resultsUpdated).to.have.callCount(1)
    expect(filterUpdated).to.have.callCount(0)
    await Tree.mutate(['root', 'filterNoData'], {
      value: 'z',
    })
    expect(service).to.have.callCount(2)
    expect(resultsUpdated).to.have.callCount(2)
    expect(filterUpdated).to.have.callCount(1)
    await Tree.mutate(['root', 'filterGroup', 'filterChild'], {
      value: 'z',
    })
    expect(service).to.have.callCount(3)
    expect(resultsUpdated).to.have.callCount(3)
    expect(filterUpdated).to.have.callCount(2)
  })
  it('Tree lenses should work', async () => {
    let service = sinon.spy(mockService({}))
    let resultsUpdated = sinon.spy()
    let filterUpdated = sinon.spy()
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
    expect(lens.get()).to.equal(null)
    await lens.set(['values'])
    expect(lens.get()).to.deep.equal(['values'])
    expect(filterUpdated).to.have.callCount(0)
    expect(resultsUpdated).to.have.callCount(1)
  })
  it('should support custom actions', async () => {
    let service = sinon.spy(mockService({}))
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
    expect(service).to.have.callCount(1)
    let [dto, now] = service.getCall(0).args
    expect(dto).to.deep.equal({
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
    expect(node).to.deep.equal(newNode)
    expect(newNode.key).to.equal('f')
    expect(newNode.special).to.equal(true)
  })
  it('should support custom reactors', async () => {
    let service = sinon.spy(mockService({}))
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
      onlySpecial: parent => _.filter('special', parent.children),
    }))
    await tree.dispatch({ type: 'onlySpecial', path: ['root', 'b'] })
    expect(service).to.have.callCount(1)
    let [dto, now] = service.getCall(0).args
    expect(dto).to.deep.equal({
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
    let spy = sinon.spy(mockService({}))
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
    expect(node.updating).to.be.true
    await node.updatingPromise
    expect(node.updating).to.be.false
  })
  describe('Previously fixed bugs', () => {
    it('should not incorrectly mark siblings for update when their parents are marked on self', async () => {
      let service = addDelay(10, sinon.spy(mockService()))
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
      expect(tree.getNode(['root', 'criteria', 'vendors']).lastUpdateTime).to.be
        .null
    })
    it('should not prevent siblings from updating', async () => {
      let service = addDelay(10, sinon.spy(mockService()))
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
      expect(tree.getNode(['root', 'criteria1', 'vendors']).lastUpdateTime).to
        .not.be.null
    })
    it('should not keep nodes without results updating forever', async () => {
      let service = sinon.spy(mockService())
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
      expect(!!tree.getNode(['root', 'vendors']).updating).to.be.false
      await tree.mutate(['root', 'agencies'], { values: ['City of Deerfield'] })
      // Since this is `text`, it won't get a context back but should still not be updating
      expect(!!tree.getNode(['root', 'vendors']).updating).to.be.false
    })
  })
  it('should support subquery', async () => {
    let spy = sinon.spy(
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
          useValues: x => ({ values: x }),
          getValues: x => _.map('name', x.context.options),
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
      sourceTree.getNode(['innerRoot', 'c']).context.options
    ).to.deep.equal([{ name: 1 }, { name: 2 }])
    expect(targetTree.getNode(['root', 'a']).values).to.deep.equal([1, 2])

    // Mutate on sourceTree will await the Subquery into targetTree
    // so results are fetched only once despite dispatching them directly
    expect(spy).to.have.callCount(2)

    expect(targetTree.getNode(['root', 'b']).markedForUpdate).to.be.false
    expect(targetTree.getNode(['root', 'b']).updating).to.be.false
    expect(targetTree.getNode(['root', 'b']).context.count).to.equal(1)
  })
  it('should support subquery clearing target tree', async () => {
    let spy = sinon.spy(
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
          useValues: x => ({ values: x }),
          getValues: x => _.map('name', x.context.options),
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
    expect(
      sourceTree.getNode(['innerRoot', 'c']).context.options
    ).to.deep.equal([])
    expect(targetTree.getNode(['root', 'a']).values).to.deep.equal([])

    // Mutate on sourceTree will await the Subquery into targetTree
    // so results are fetched only once despite dispatching them directly
    expect(spy).to.have.callCount(2)
  })
  it('should respect disableAutoUpdate', async () => {
    let service = sinon.spy(mockService())
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
    expect(service).to.not.have.been.called
    // If it affects itself it will go through
    await tree.mutate(['root', 'agencies'], { size: 12 })
    expect(service).to.have.callCount(1)

    // Trigger Update should also let searches through
    await tree.mutate(['root', 'agencies'], { values: ['First City'] })
    expect(service).to.have.callCount(1)
    await tree.triggerUpdate()
    expect(service).to.have.callCount(2)
  })
  it('should not update nodes without values', async () => {
    // working here
    let service = sinon.spy(mockService())
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
    expect(service).to.have.callCount(0)
    await tree.mutate(['root', 'dates'], { range: 'allDates' })
    expect(service).to.have.callCount(0)

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
    expect(service).to.have.callCount(1)
  })
  it('should allow individual nodes to be updated', async () => {
    // working here
    let service = sinon.spy(mockService())
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
    expect(service).to.have.callCount(1)
    let [dto, now] = service.getCall(0).args
    expect(dto).to.deep.equal({
      children: [
        {
          filterOnly: true,
          key: 'results',
          page: 1,
          pageSize: 10,
          type: 'results',
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
    expect(service).to.have.callCount(2)
    let [body, ts] = service.getCall(1).args

    expect(body).to.deep.equal({
      children: [
        {
          key: 'results',
          page: 1,
          pageSize: 10,
          type: 'results',
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
    let service = sinon.spy(mockService())
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
    expect(service).to.have.callCount(0)

    // Tags mutate has a self affecting reactor (`all`), which will triggerImmediate and bypass disableAutoUpdate
    let toTags = _.map(word => ({ word }))
    let calls = [
      tree.mutate(['root', 'filter1'], { tags: toTags(['1']) }),
      tree.mutate(['root', 'filter1'], { tags: toTags(['1', '2']) }),
      tree.mutate(['root', 'filter1'], { tags: toTags(['1', '2', '3']) }),
      tree.mutate(['root', 'filter1'], { tags: toTags(['1', '2', '3', '4']) }),
    ]
    expect(service).to.have.callCount(0)

    // Even though 4 mutate calls were made, only 1 search should have actually triggered
    await Promise.all(calls)
    expect(service).to.have.callCount(1)
  })
  it('should call onUpdateByOthers', async () => {
    let service = sinon.spy(mockService())
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
    expect(tree.getNode(['root', 'results']).page).to.equal(1)
    expect(service).to.have.callCount(1)
  })
  it('onUpdateByOthers should not block on self update', async () => {
    let service = sinon.spy(mockService())
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
    expect(tree.getNode(['root', 'results']).page).to.equal(2)
    expect(service).to.have.callCount(1)
  })
  it('should support add at index', async () => {
    let service = sinon.spy(mockService())
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
    expect(keys).to.deep.equal(['results', 'filter1', 'analytics'])
  })
  it('should support add with children', async () => {
    let service = sinon.spy(mockService())
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
    expect(filter1Direct).to.exist
    expect(filter1Direct.path).to.deep.equal(['root', 'criteria', 'filter1'])
    expect(filter1Get).to.equal(filter1Direct)

    // Check initNode worked and added default props
    expect(filter1Get.values).to.deep.equal([])
    expect(filter1Get.path).to.deep.equal(['root', 'criteria', 'filter1'])

    // "move" to another node location and make sure everything is updated
    await tree.mutate(['root', 'criteria', 'filter1'], { values: [1, 2, 3] })
    await tree.remove(['root', 'criteria', 'filter1'])
    expect(tree.getNode(['root', 'criteria', 'filter1'])).not.to.exist
    expect(filter1Direct).to.exist
    await tree.add(['root'], filter1Direct)

    let newlyAddedNode = tree.getNode(['root', 'filter1'])
    expect(newlyAddedNode).to.exist
    expect(newlyAddedNode.path).to.deep.equal(['root', 'filter1'])
    expect(newlyAddedNode.values).to.deep.equal([1, 2, 3])
  })
  it('should remove children from flat array', async () => {
    let service = sinon.spy(mockService())
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
    expect(tree.getNode(['root', 'criteria'])).to.not.exist
    expect(tree.getNode(['root', 'criteria', 'filter1'])).to.not.exist
  })
  it('should replace', async () => {
    let service = sinon.spy(mockService())
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
    expect(tree.tree.children[1].key).to.deep.equal('criteria')
    // Replace with a transform
    await tree.replace(['root', 'criteria'], node => ({
      ...node,
      key: 'criteria1',
      values: [1, 2, 3],
    }))
    expect(tree.getNode(['root', 'criteria'])).to.not.exist
    expect(tree.getNode(['root', 'criteria1']).values).to.deep.equal([1, 2, 3])
    expect(tree.getNode(['root', 'criteria1']).children).to.have.lengthOf(2)
    // Confirm it's at the right index
    expect(tree.tree.children[1].key).to.deep.equal('criteria1')
    // Replace with a new object
    await tree.replace(['root', 'criteria1'], () => ({
      key: 'criteria2',
      type: 'facet',
    }))
    expect(tree.getNode(['root', 'criteria'])).to.not.exist
    expect(tree.getNode(['root', 'criteria2']).values).to.deep.equal([])
    expect(tree.getNode(['root', 'criteria2']).children).to.not.exist
    expect(tree.tree.children[1].key).to.deep.equal('criteria2')
  })
  it('should clear', async () => {
    let service = sinon.spy(mockService())
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

    expect(tree.getNode(['root', 'criteria', 'filter1']).tags).to.deep.equal([])
    expect(tree.getNode(['root', 'criteria', 'filter2']).tags).to.deep.equal([])

    expect(tree.getNode(['root', 'criteria', 'filter1']).join).to.equal('none')
    expect(tree.getNode(['root', 'criteria', 'filter2']).join).to.equal('any')
  })
  it('should wrapInGroup replace', async () => {
    let service = sinon.spy(mockService())
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
    tree.addActions(config => wrap(config, tree))
    await tree.wrapInGroupReplace(['root', 'results'], {
      key: 'analytics',
      join: 'and',
    })

    expect(tree.getNode(['root', 'analytics'])).to.exist
    expect(tree.getNode(['root', 'results'])).not.to.exist
    expect(tree.getNode(['root', 'analytics', 'results'])).to.exist
  })
  it('should wrapInGroup root', async () => {
    let service = sinon.spy(mockService())
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
    tree.addActions(config => wrap(config, tree))
    await tree.wrapInGroupInPlace(['root'], { key: 'newRootChild', join: 'or' })

    expect(tree.getNode(['newRootChild'])).to.exist
    expect(tree.getNode(['newRootChild']).join).to.equal('or')
    expect(tree.getNode(['newRootChild', 'root'])).to.exist
    expect(tree.getNode(['newRootChild', 'root', 'results'])).to.exist
    expect(
      tree.getNode(['newRootChild', 'root', 'criteria']).path
    ).to.deep.equal(['newRootChild', 'root', 'criteria'])
  })
  it('should wrapInGroup', async () => {
    let service = sinon.spy(mockService())
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
    tree.addActions(config => wrap(config, tree))
    await tree.wrapInGroup(['root', 'results'], {
      key: 'analytics',
      join: 'and',
    })

    expect(tree.getNode(['root', 'analytics'])).to.exist
    expect(tree.getNode(['root', 'results'])).not.to.exist
    expect(tree.getNode(['root', 'analytics', 'results'])).to.exist

    await tree.wrapInGroupInPlace(['root'], { key: 'newRootChild', join: 'or' })

    expect(tree.getNode(['newRootChild'])).to.exist
    expect(tree.getNode(['newRootChild']).join).to.equal('or')
    expect(tree.getNode(['newRootChild', 'root'])).to.exist
    expect(tree.getNode(['newRootChild', 'root', 'analytics', 'results'])).to
      .exist
    expect(
      tree.getNode(['newRootChild', 'root', 'criteria']).path
    ).to.deep.equal(['newRootChild', 'root', 'criteria'])
  })
  it('should move', async () => {
    let service = sinon.spy(mockService())
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
    expect(tree.getNode(['root', 'criteria']).children[0].key).to.equal(
      'filter1'
    )
    expect(tree.getNode(['root', 'criteria']).children[1].key).to.equal(
      'filter2'
    )

    await tree.move(['root', 'criteria', 'filter1'], { index: 1 })
    expect(tree.getNode(['root', 'criteria']).children[0].key).to.equal(
      'filter2'
    )
    expect(tree.getNode(['root', 'criteria']).children[1].key).to.equal(
      'filter1'
    )
    expect(service).to.have.not.been.called

    await tree.move(['root', 'criteria', 'filter1'], { path: ['root'] })
    expect(tree.getNode(['root', 'criteria', 'filter1'])).to.not.exist
    expect(tree.getNode(['root', 'filter1'])).to.exist
    expect(service).to.have.callCount(1)
  })
  it('should support pause actions', async () => {
    let service = sinon.spy(mockService())
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
    expect(tree.isPausedNested(['root', 'criteria'])).to.be.false
    expect(tree.getNode(['root', 'criteria', 'filter1']).paused).to.not.be.true
    expect(tree.getNode(['root', 'criteria', 'filter2']).paused).to.not.be.true
    await tree.pauseNested(['root', 'criteria'])
    expect(tree.isPausedNested(['root', 'criteria'])).to.be.true
    expect(tree.getNode(['root', 'criteria', 'filter1']).paused).to.be.true
    expect(tree.getNode(['root', 'criteria', 'filter2']).paused).to.be.true
    await tree.unpauseNested(['root', 'criteria'])
    expect(tree.isPausedNested(['root', 'criteria'])).to.be.false
    expect(tree.getNode(['root', 'criteria', 'filter1']).paused).to.be.false
    expect(tree.getNode(['root', 'criteria', 'filter2']).paused).to.be.false
  })
  it('should autogenerate keys on node add', async () => {
    let service = sinon.spy(mockService())
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
    expect(tree.getNode(['root', 'criteria', 'field-facet2'])).to.not.exist
    // should dedupe added nodes against existing siblings
    await tree.add(['root', 'criteria'], { type: 'facet', field: 'field' })
    expect(tree.getNode(['root', 'criteria', 'field-facet2'])).to.exist
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
    expect(tree.getNode(['root', 'group', 'birthday-date'])).to.exist
    // should still dedupe nodes with user-created keys
    await tree.add(['root', 'group'], { key: 'birthday-date' })
    expect(tree.getNode(['root', 'group', 'birthday-date1'])).to.exist
    // should use the type-config autokey if one exists (as it does for terms_stats)
    await tree.add(['root'], {
      type: 'terms_stats',
      key_field: 'holland',
      value_field: 'oats',
    })
    expect(tree.getNode(['root', 'holland-oats-terms_stats'])).to.exist
  })
  it('should autogenerate keys on tree initialization', () => {
    let service = sinon.spy(mockService())
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
    expect(tree.getNode(['root', 'criteria', 'field-facet'])).to.exist
    expect(tree.getNode(['root', 'criteria', 'field-facet1'])).to.exist
    expect(tree.getNode(['root', 'criteria', 'group', 'pizza-query'])).to.exist
    expect(
      _.map(
        'key',
        tree.getNode(['root', 'criteria', 'group', 'group']).children
      )
    ).to.deep.equal(['node', 'node1', 'node11', 'node2'])
  })
  it('should have debugInfo', async () => {
    let service = sinon.spy(mockService())
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
    expect(tree.debugInfo.dispatchHistory).to.deep.equal([])
    await tree.mutate(['root', 'filter'], {
      values: ['a'],
    })
    let dispatchRecord = tree.debugInfo.dispatchHistory[0]
    expect(dispatchRecord.node).to.exist
    expect(dispatchRecord.type).to.equal('mutate')
    expect(dispatchRecord.path).to.deep.equal(['root', 'filter'])
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
    expect(tree.debugInfo.dispatchHistory).to.deep.equal([])
    await tree.mutate(['root', 'filter'], {
      values: ['a'],
    })
    let resultsNode = tree.getNode(['root', 'results'])
    expect(resultsNode.metaHistory).to.exist
    expect(resultsNode.metaHistory[0].requests[0].response.hits.total).to.equal(
      1
    )
  })
  it('should support processResponseNode', () => {
    let service = sinon.spy(mockService())
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
    Tree.processResponseNode(['root', 'analysis', 'results'], {
      context: { response: { totalRecords: 1337 } },
    })
    expect(
      Tree.tree.children[0].children[0].context.response.totalRecords
    ).to.equal(1337)
    expect(service).to.have.callCount(0)
  })
  it('should support response merges', async () => {
    let service = sinon.spy(mockService())
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
    expect(toJS(Tree.tree.children[0].context.results)).to.deep.equal([
      { title: 'some result' },
      { title: 'some result' },
    ])

    // update by others forces response replace instead of merge
    await Tree.mutate(['root', 'test'], { values: ['asdf'] })
    expect(toJS(Tree.tree.children[0].context.results)).to.deep.equal([
      { title: 'some result' },
    ])
  })
  it('should support key based pivot response merges', async () => {
    let service = sinon.spy(mockService())
    let groups = [
      { type: 'fieldValuesPartition', field: 'State', matchValue: 'Florida' },
      { type: 'fieldValues', field: 'City', size: 10 },
    ]
    let Tree = ContextureClient(
      { service, debounce: 1 },
      {
        key: 'root',
        join: 'and',
        children: [
          { key: 'pivot', type: 'pivot', groups },
          { key: 'test', type: 'facet', values: [] },
        ],
      }
    )
    let node = Tree.getNode(['root', 'pivot'])

    let merge = results =>
      exampleTypes.pivot.mergeResponse(
        node,
        { context: { results } },
        Tree.extend,
        Tree.snapshot
      )
    merge({
      groups: [
        { key: 'FL', groups: [{ key: 'fl1', a: 1 }] },
        { key: 'NV', groups: [{ key: 'nv1', a: 1 }] },
      ],
    })
    merge({
      groups: [
        {
          key: 'NV',
          groups: [
            { key: 'nv2', b: 1 },
            { key: 'nv1', a: 2 },
          ],
        },
      ],
    })

    expect(node.context.results).to.deep.equal({
      groups: [
        { key: 'FL', groups: [{ key: 'fl1', a: 1 }] },
        {
          key: 'NV',
          groups: [
            { key: 'nv1', a: 2 },
            { key: 'nv2', b: 1 },
          ],
        },
      ],
    })
  })
  it('should merge pivot response with nested groups and columns', async () => {
    let service = sinon.spy(mockService())
    let columns = [{ type: 'dateInterval', field: 'Date', interval: 'year' }]
    let groups = [
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
          { key: 'pivot', type: 'pivot', columns, groups },
          { key: 'test', type: 'facet', values: [] },
        ],
      }
    )
    let node = Tree.getNode(['root', 'pivot'])

    let merge = results =>
      exampleTypes.pivot.mergeResponse(
        node,
        { context: { results } },
        Tree.extend,
        Tree.snapshot
      )
    merge({
      groups: [
        {
          key: 'FL',
          columns: [
            { key: '2021', a: 3 },
            { key: '2022', a: 4 },
          ],
          groups: [],
        },
        {
          key: 'NV',
          columns: [
            { key: '2021', a: 6 },
            { key: '2022', a: 8 },
          ],
          groups: [],
        },
      ],
    })
    merge({
      groups: [
        {
          key: 'FL',
          columns: [
            { key: '2021', a: 3 },
            { key: '2022', a: 4 },
          ],
          groups: [
            {
              key: 'Miami',
              columns: [
                { key: '2021', a: 2 },
                { key: '2022', a: 3 },
              ],
              groups: [],
            },
            {
              key: 'Hollywood',
              columns: [
                { key: '2021', a: 1 },
                { key: '2022', a: 1 },
              ],
              groups: [],
            },
          ],
        },
      ],
    })
    merge({
      groups: [
        {
          key: 'FL',
          columns: [
            { key: '2021', a: 3 },
            { key: '2022', a: 4 },
          ],
          groups: [
            {
              key: 'Miami',
              columns: [
                { key: '2021', a: 2 },
                { key: '2022', a: 3 },
              ],
              groups: [
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

    expect(node.context.results).to.deep.equal({
      groups: [
        {
          key: 'FL',
          columns: [
            { key: '2021', a: 3 },
            { key: '2022', a: 4 },
          ],
          groups: [
            {
              key: 'Miami',
              columns: [
                { key: '2021', a: 2 },
                { key: '2022', a: 3 },
              ],
              groups: [
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
              groups: [],
            },
          ],
        },
        {
          key: 'NV',
          columns: [
            { key: '2021', a: 6 },
            { key: '2022', a: 8 },
          ],
          groups: [],
        },
      ],
    })
  })
  it('should support onDispatch (and pivot overriding response merges)', async () => {
    let service = sinon.spy(mockService())
    let groups = [
      { type: 'fieldValuesPartition', field: 'State', matchValue: 'Florida' },
      { type: 'fieldValues', field: 'City', size: 10 },
    ]
    let Tree = ContextureClient(
      { service, debounce: 1 },
      {
        key: 'root',
        join: 'and',
        children: [
          { key: 'pivot', type: 'pivot', groups },
          { key: 'test', type: 'facet', values: [] },
        ],
      }
    )

    // These tests set `forceReplaceResponse` conditionally during mutate based on the pivot's onDispatch
    // Changing fieldValues Size doesn't force replace
    Tree.mutate(['root', 'pivot'], { groups: _.set('1.size', 20, groups) })
    expect(!!Tree.getNode(['root', 'pivot']).forceReplaceResponse).be.false

    // Changing fieldValuesPartition matchValue does force replace
    Tree.mutate(['root', 'pivot'], {
      groups: _.set('0.matchValue', 'Nevada', groups),
    })
    expect(Tree.getNode(['root', 'pivot']).forceReplaceResponse).to.equal(true)
  })
  it('should support watchNode', async () => {
    let service = sinon.spy(mockService())
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
    let resultWatcher = sinon.spy()
    Tree.watchNode(['root', 'results'], resultWatcher, ['page', 'context'])
    let facetWatcher = sinon.spy()
    Tree.watchNode(['root', 'test'], facetWatcher, ['values'])

    let promise = Tree.mutate(['root', 'results'], { page: 1 })
    expect(resultWatcher).to.have.callCount(1)
    await promise
    expect(resultWatcher).to.have.callCount(2)
    await Tree.mutate(['root', 'results'], { page: 2 })
    expect(resultWatcher).to.have.callCount(4)

    await Tree.mutate(['root', 'test'], { values: ['asdf'] })
    expect(facetWatcher).to.have.callCount(1)
    // resultWatcher called twice more because facet change resets page to 0
    expect(resultWatcher).to.have.callCount(6)
  })
  it('should getNode', async () => {
    let service = sinon.spy(mockService())
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
    expect(result.infiniteScroll).to.be.true
  })
}

describe('lib', () => AllTests(ContextureClient))
describe('mobx', () => AllTests(ContextureMobx))
