import _ from 'lodash/fp'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import ContextureClient, { encode } from '../src'
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

sinon.spy.reset = sinon.spy.resetHistory

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
    it('should remove filterOnly nodes with no value', async () => {
      service.reset()
      await Tree.mutate(['root', 'filter'], {
        size: 10,
      })
      expect(service).to.have.callCount(1)
      let [dto, now] = service.getCall(0).args
      // Should omit `results`
      expect(dto).to.deep.equal({
        key: 'root',
        join: 'and',
        lastUpdateTime: now,
        children: [
          {
            key: 'filter',
            type: 'facet',
            values: ['a'],
            size: 10,
            mode: 'include',
            lastUpdateTime: now,
            optionsFilter: '',
          },
        ],
      })
    })
    it('should not block blank searches', async () => {
      service.reset()
      await Tree.mutate(['root', 'filter'], {
        values: [],
      })
      expect(service).to.have.callCount(1)
    })
    it('should not search if nothing needs updating', async () => {
      service.reset()
      expect(service).to.have.callCount(0)
      await Tree.dispatch({
        path: ['root'],
        type: 'notAType',
      })
      expect(service).to.have.callCount(0)
    })
    // it('should not dispatch if there is no mutation')
    it('should handle join changes', async () => {
      service.reset()
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
      service.reset()
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
      service.reset()
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
      service.reset()
      await Tree.refresh(['root'])
      expect(service).to.have.callCount(1)
    })
    it('should support field changes')
    it('should probably support type changes ¯\\_(ツ)_/¯')

    it('should (un)pause', async () => {
      service.reset()
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
  // it('should ignore searches where everything is filterOnly', () => {
  //   let Tree = ContextureClient({}, {
  //     key: 'root',
  //     children: [{
  //       key:'filter'
  //     }, {
  //       key: 'results'
  //     }]
  //   }),

  // })
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
        mocks({ key, type }) {
          if (type === 'facet')
            return {
              options: {
                c: [{ name: 1 }, { name: 2 }],
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

    let tree1 = Tree({
      key: 'innerRoot',
      join: 'and',
      children: [{ key: 'c', type: 'facet' }, { key: 'd', type: 'facet' }],
    })
    let tree2 = Tree({
      key: 'root',
      join: 'and',
      children: [{ key: 'a', type: 'facet' }, { key: 'b', type: 'results' }],
    })

    // subquery(types, tree2, ['root', 'a'], tree1, ['innerRoot', 'c'])
    tree2.subquery(['root', 'a'], tree1, ['innerRoot', 'c'])
    let promise = tree1.mutate(['innerRoot', 'd'], { values: ['test'] })

    // Expect the toNode to be marked for update immediately
    await Promise.delay(1)
    expect(tree2.getNode(['root', 'a']).markedForUpdate).to.be.true

    await promise
    expect(tree1.getNode(['innerRoot', 'c']).context.options).to.deep.equal([
      { name: 1 },
      { name: 2 },
    ])
    expect(tree2.getNode(['root', 'a']).values).to.deep.equal([1, 2])

    // Mutate on tree1 will await the Subquery into tree2
    expect(spy).to.have.callCount(2)

    expect(tree2.getNode(['root', 'b']).markedForUpdate).to.be.false
    expect(tree2.getNode(['root', 'b']).updating).to.be.false
    expect(tree2.getNode(['root', 'b']).context.count).to.equal(1)
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
    await tree.replace(['root', 'criteria'], {
      key: 'criteria1',
      type: 'facet',
    })
    expect(tree.getNode(['root', 'criteria'])).to.not.exist
    expect(tree.getNode(['root', 'criteria1']).values).to.deep.equal([])
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
    await tree.wrapInGroup(['root', 'results'], { key: 'analytics', join: 'and' })

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
    await tree.setPausedNested(['root', 'criteria'], true)
    expect(tree.isPausedNested(['root', 'criteria'])).to.be.true
    expect(tree.getNode(['root', 'criteria', 'filter1']).paused).to.be.true
    expect(tree.getNode(['root', 'criteria', 'filter2']).paused).to.be.true
  })
}

describe('lib', () => AllTests(ContextureClient))
describe('mobx', () => AllTests(ContextureMobx))
