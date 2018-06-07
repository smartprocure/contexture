import { Tree } from '../src/util/tree'
import * as F from 'futil-js'
import _ from 'lodash/fp'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import ContextureClient from '../src'
import { observable, reaction, toJS, set, action } from 'mobx'
const expect = chai.expect
chai.use(sinonChai)

let ContextureMobx = x =>
  _.flow(
    observable,
    ContextureClient({
      snapshot: toJS,
      extend: set,
      ...x,
    }),
    // contexture-client here takes a whole observable tree and doesn't make initial values observable itself so we need to wrap new nodes in observable
    F.updateOn('add', add =>
      action((path, node) => add(path, observable(node)))
    ),
    F.updateOn('remove', action),
    F.updateOn('mutate', action),
    F.updateOn('refresh', action)
  )

let treeUtils = Tree

describe('usage with mobx should generally work', () => {
  // TODO: make these generally self contained - some rely on previous test runs
  let tree = {
    key: 'root',
    join: 'and',
    children: [
      {
        key: 'filter',
        type: 'facet',
        values: [1, 2],
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
        size: 20,
      },
      {
        key: 'filter',
        type: 'facet',
      },
    ],
  }
  let service = sinon.spy(() => responseData)

  let Tree = ContextureMobx({ service, debounce: 1 })(tree)

  let reactor = sinon.spy()

  it('should generally mutate and have updated contexts', async () => {
    let disposer = reaction(() => toJS(Tree.tree), reactor)
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
          values: ['a'],
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
    expect(reactor).to.satisfy(x => x.callCount > 1)
    disposer()
    expect(
      F.compactObject(treeUtils.lookup(['filter'], reactor.getCall(1).args[0]))
    ).to.deep.equal({
      key: 'filter',
      type: 'facet',
      values: ['a'],
      hasValue: 1,
      path: ['root', 'filter'],
      context: {
        options: [],
        cardinality: null,
      },
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
      treeUtils.lookup(['results'], reactor.lastCall.args[0]).context
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
    let disposer = reaction(() => toJS(Tree.tree), reactor)
    await Tree.add(['root'], {
      key: 'newFilter',
      type: 'text',
    })
    expect(service).to.have.callCount(0)
    await Tree.add(['root'], {
      key: 'newFilterWithValue',
      type: 'facet',
      values: 'asdf',
    })
    expect(service).to.have.callCount(1)
    expect(reactor).to.satisfy(x => x.callCount > 1)
    expect(
      F.compactObject(
        treeUtils.lookup(['newFilterWithValue'], reactor.getCall(2).args[0])
      )
    ).to.deep.equal({
      key: 'newFilterWithValue',
      type: 'facet',
      values: 'asdf',
      path: ['root', 'newFilterWithValue'],
      context: {
        options: [],
        cardinality: null,
      },
    })
    disposer()
  })

  it('should support remove', async () => {
    reactor.reset()
    service.reset()
    let disposer = reaction(() => toJS(Tree.tree), reactor)

    await Tree.add(['root'], {
      key: 'newEmptyFilter',
      type: 'facet',
      context: {},
    })
    expect(service).to.have.callCount(1)
    expect(reactor).to.satisfy(x => x.callCount > 1)
    expect(Tree.getNode(['root', 'newEmptyFilter'])).to.exist

    let previousCallCount = reactor.callCount
    await Tree.remove(['root', 'newEmptyFilter'])
    expect(service).to.have.callCount(1)
    expect(reactor).to.satisfy(x => x.callCount > previousCallCount)
    expect(Tree.getNode(['root', 'newEmptyFilter'])).to.not.exist

    previousCallCount = reactor.callCount
    await Tree.add(['root'], {
      key: 'newFilterWithValueForRemoveTest',
      type: 'facet',
      values: 'asdf',
    })
    expect(service).to.have.callCount(2)
    expect(reactor).to.satisfy(x => x.callCount > previousCallCount)
    expect(Tree.getNode(['root', 'newFilterWithValueForRemoveTest'])).to.exist

    previousCallCount = reactor.callCount
    await Tree.remove(['root', 'newFilterWithValueForRemoveTest'])
    expect(Tree.getNode(['root', 'newFilterWithValueForRemoveTest'])).to.not
      .exist
    expect(service).to.have.callCount(3)
    expect(reactor).to.satisfy(x => x.callCount > previousCallCount)

    expect(
      F.compactObject(
        treeUtils.lookup(['newEmptyFilter'], reactor.getCall(0).args[0])
      )
    ).to.deep.equal({
      key: 'newEmptyFilter',
      type: 'facet',
      path: ['root', 'newEmptyFilter'],
      context: {},
      values: [],
    })
    expect(
      _.flow(
        _.omit(['lastUpdateTime']),
        F.compactObject
      )(treeUtils.lookup(['newEmptyFilter'], reactor.getCall(1).args[0]))
    ).to.deep.equal({
      key: 'newEmptyFilter',
      type: 'facet',
      context: {},
      path: ['root', 'newEmptyFilter'],
      values: [],
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
        reactor.lastCall.args[0]
      )
    ).to.deep.equal(undefined)
    disposer()
  })

  it('should support retrieving results with different array sizes', async () => {
    reactor.reset()
    service.reset()
    let disposer = reaction(() => toJS(Tree.tree), reactor)

    await Tree.mutate(['root', 'filter'], {
      values: [1, 2, 3],
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
      values: [1, 2, 3, 4],
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
