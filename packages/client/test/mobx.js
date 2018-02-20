import { Tree } from '../src/util/tree'
import _ from 'lodash/fp'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import * as lib from '../src'
import { observable, reaction, toJS, extendObservable } from 'mobx'
const expect = chai.expect
chai.use(sinonChai)

let treeUtils = Tree
let ContextTreeMobx = (tree, service) =>
  lib.ContextTree(
    {
      service,
      snapshot: toJS,
      extend: extendObservable,
    },
    tree
  )

describe('usage with mobx should generally work', () => {
  // TODO: make these generally self contained - some rely on previous test runs
  let tree = observable({
    key: 'root',
    join: 'and',
    children: [
      {
        key: 'filter',
        data: {
          values: [1, 2],
        },
      },
      {
        key: 'results',
        type: 'results',
        context: {
          results: null,
        },
      },
    ],
  })
  let responseData = {
    key: 'root',
    children: [
      {
        key: 'results',
        context: {
          count: 1,
          results: [
            {
              title: 'Some result',
            },
            {
              title: 'Some other result',
            },
          ],
        },
        config: {
          size: 20,
        },
      },
      {
        key: 'filter',
      },
    ],
  }
  let service = sinon.spy(() => ({
    data: responseData,
  }))

  let Tree = ContextTreeMobx(tree, service)
  let reactor = sinon.spy()

  it('should generally mutate and have updated contexts', async () => {
    let disposer = reaction(() => toJS(tree), reactor)
    await Tree.mutate(['root', 'filter'], {
      data: {
        values: ['a'],
      },
    })
    expect(service).to.have.callCount(1)
    let [dto, now] = service.getCall(0).args
    expect(dto).to.deep.equal({
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'filter',
          data: {
            values: ['a'],
          },
          filterOnly: true,
        },
        {
          key: 'results',
          type: 'results',
          lastUpdateTime: now,
        },
      ],
    })
    expect(reactor).to.have.callCount(10)
    disposer()
    expect(
      treeUtils.lookup(['filter'], reactor.getCall(1).args[0])
    ).to.deep.equal({
      key: 'filter',
      error: null,
      lastUpdateTime: null,
      context: null,
      pause: null,
      hasValue: true,
      markedForUpdate: null,
      missedUpdate: null,
      updating: null,
      data: {
        values: ['a'],
      },
      path: ['root', 'filter'],
    })
    // should update contexts
    expect(Tree.getNode(['root', 'results']).updating).to.be.false
    expect(toJS(Tree.getNode(['root', 'results']).context)).to.deep.equal({
      count: 1,
      results: [
        {
          title: 'Some result',
        },
        {
          title: 'Some other result',
        },
      ],
    })
    expect(
      treeUtils.lookup(['results'], reactor.getCall(8).args[0]).context
    ).to.deep.equal({
      count: 1,
      results: [
        {
          title: 'Some result',
        },
        {
          title: 'Some other result',
        },
      ],
    })
  })

  it('should support add', async () => {
    reactor.reset()
    service.reset()
    let disposer = reaction(() => toJS(tree), reactor)
    await Tree.add(['root'], {
      key: 'newFilter',
      type: 'facet',
    })
    expect(service).to.have.callCount(0)
    await Tree.add(['root'], {
      key: 'newFilterWithValue',
      type: 'facet',
      data: {
        values: 'asdf',
      },
    })
    expect(service).to.have.callCount(1)
    expect(reactor).to.have.callCount(18)
    expect(
      treeUtils.lookup(['newFilterWithValue'], reactor.getCall(2).args[0])
    ).to.deep.equal({
      key: 'newFilterWithValue',
      type: 'facet',
      error: null,
      hasValue: null,
      markedForUpdate: null,
      missedUpdate: null,
      updating: null,
      lastUpdateTime: null,
      context: null,
      pause: null,
      data: {
        values: 'asdf',
      },
      path: ['root', 'newFilterWithValue'],
    })
    disposer()
  })

  it('should support remove', async () => {
    reactor.reset()
    service.reset()
    let disposer = reaction(() => toJS(tree), reactor)

    await Tree.add(['root'], {
      key: 'newEmptyFilter',
      type: 'facet',
      context: {},
    })
    expect(service).to.have.callCount(1)
    expect(reactor).to.have.callCount(7)
    expect(Tree.getNode(['root', 'newEmptyFilter'])).to.exist

    await Tree.remove(['root', 'newEmptyFilter'])
    expect(service).to.have.callCount(1)
    expect(reactor).to.have.callCount(8)
    expect(Tree.getNode(['root', 'newEmptyFilter'])).to.not.exist

    await Tree.add(['root'], {
      key: 'newFilterWithValueForRemoveTest',
      type: 'facet',
      data: {
        values: 'asdf',
      },
    })
    expect(service).to.have.callCount(2)
    expect(reactor).to.have.callCount(26)
    expect(Tree.getNode(['root', 'newFilterWithValueForRemoveTest'])).to.exist

    await Tree.remove(['root', 'newFilterWithValueForRemoveTest'])
    expect(Tree.getNode(['root', 'newFilterWithValueForRemoveTest'])).to.not
      .exist
    expect(service).to.have.callCount(3)
    expect(reactor).to.have.callCount(42)

    expect(
      treeUtils.lookup(['newEmptyFilter'], reactor.getCall(0).args[0])
    ).to.deep.equal({
      key: 'newEmptyFilter',
      type: 'facet',
      lastUpdateTime: null,
      path: ['root', 'newEmptyFilter'],
      error: null,
      hasValue: null,
      markedForUpdate: null,
      missedUpdate: null,
      updating: null,
      context: {},
      pause: null,
    })
    expect(
      _.omit(
        ['lastUpdateTime'],
        treeUtils.lookup(['newEmptyFilter'], reactor.getCall(1).args[0])
      )
    ).to.deep.equal({
      key: 'newEmptyFilter',
      type: 'facet',
      error: null,
      hasValue: false,
      updating: null,
      context: {},
      pause: null,
      markedForUpdate: null,
      missedUpdate: null,
      path: ['root', 'newEmptyFilter'],
    })

    expect(
      treeUtils.lookup(
        ['newFilterWithValueForRemoveTest'],
        reactor.getCall(0).args[0]
      )
    ).to.equal(undefined)
    expect(
      treeUtils.lookup(
        ['newFilterWithValueForRemoveTest'],
        reactor.getCall(23).args[0]
      )
    ).to.deep.equal({
      key: 'newFilterWithValueForRemoveTest',
      type: 'facet',
      data: {
        values: 'asdf',
      },
      lastUpdateTime: null,
      path: ['root', 'newFilterWithValueForRemoveTest'],
      error: null,
      hasValue: true,
      markedForUpdate: null,
      missedUpdate: null,
      updating: null,
      context: null,
      pause: null,
    })
    disposer()
  })

  it('should support retrieving results with different array sizes', async () => {
    reactor.reset()
    service.reset()
    let disposer = reaction(() => toJS(tree), reactor)

    await Tree.mutate(['root', 'filter'], {
      data: {
        values: [1, 2, 3],
      },
    })
    expect(service).to.have.callCount(1)
    expect(
      Tree.getNode(['root', 'results']).context.results.slice()
    ).to.deep.equal([
      {
        title: 'Some result',
      },
      {
        title: 'Some other result',
      },
    ])
    treeUtils.lookup(['results'], responseData).context.results = [
      {
        title: 'New values',
      },
    ]
    await Tree.mutate(['root', 'filter'], {
      data: {
        values: [1, 2, 3, 4],
      },
    })
    expect(service).to.have.callCount(2)
    expect(
      Tree.getNode(['root', 'results']).context.results.slice()
    ).to.deep.equal([
      {
        title: 'New values',
      },
    ])
    disposer()
  })
})
