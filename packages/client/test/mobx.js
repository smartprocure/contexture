import {keyPath} from '../src/util/tree'
import * as F from 'futil-js'
import _ from 'lodash/fp'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import * as lib from '../src'
import { observable, reaction, toJS, extendObservable } from 'mobx'
const expect = chai.expect
chai.use(sinonChai)

let traverse = x => x && x.children && x.children.slice() // mobx needs slice
let treeUtils = F.tree(traverse, keyPath)
let ContextTreeMobx = (tree, service) => lib.ContextTree(tree, service, undefined, { snapshot: toJS, extend: extendObservable })

describe('should generally work', () => {
  // TODO: make these generally self contained - some rely on previous test runs
  let tree = observable({
    key: 'root',
    join: 'and',
    children: [{
      key: 'filter',
      data: {
        values: null
      }
    }, {
      key: 'results',
      context: {
        results: null
      }
    }]
  })
  let service = sinon.spy(() => ({
    data: {
      key: 'root',
      children: [{
        key: 'results',
        context: {
          count: 1,
          results: [{
            title: 'some result'
          }]
        },
        config: {
          size: 20
        }
      }, {
        key: 'filter'
      }]
    }
  }))

  let Tree = ContextTreeMobx(tree, service)
  let reactor = sinon.spy()

  it('should generally mutate and have updated contexts', async () => {
    let disposer = reaction(() => toJS(tree), reactor)
    await Tree.mutate(['root', 'filter'], {
      data: {
        values: ['a']
      }
    })
    expect(service).to.have.callCount(1)
    let [dto, now] = service.getCall(0).args
    expect(dto).to.deep.equal({
      key: 'root',
      join: 'and',
      children: [{
        key: 'filter',
        data: {
          values: ['a']
        },
        filterOnly: true
      }, {
        key: 'results',
        lastUpdateTime: now,
        context: {
          results: null
        }
      }]
    })
    expect(reactor).to.have.callCount(2)
    disposer()
    expect(treeUtils.lookup(['filter'], reactor.getCall(0).args[0])).to.deep.equal({
      key: 'filter',
      path: 'root->filter',
      data: {
        values: ['a']
      },
    })
    // should update contexts
    expect(Tree.getNode(['root', 'results']).updating).to.be.false
    expect(toJS(Tree.getNode(['root', 'results']).context)).to.deep.equal({
      count: 1,
      results: [{
        title: 'some result'
      }]
    })
    expect(treeUtils.lookup(['results'], reactor.getCall(1).args[0]).context).to.deep.equal({
      count: 1,
      results: [{
        title: 'some result'
      }]
    })
  })

  it('should support add', async () => {
    reactor.reset()
    service.reset()
    let disposer = reaction(() => toJS(tree), reactor)
    await Tree.add(['root'], {
      key: 'newFilter'
    })
    expect(service).to.have.callCount(0)
    await Tree.add(['root'], {
      key: 'newFilterWithValue',
      data: {
        values: 'asdf'
      }
    })
    expect(service).to.have.callCount(1)
    expect(reactor).to.have.callCount(3)
    expect(treeUtils.lookup(['newFilterWithValue'], reactor.getCall(1).args[0])).to.deep.equal({
      key: 'newFilterWithValue',
      path: 'root->newFilterWithValue',
      data: {
        values: 'asdf'
      },
    })
    disposer()
  })

  it('should support remove', async () => {
    reactor.reset()
    service.reset()
    let disposer = reaction(() => toJS(tree), reactor)
    await Tree.add(['root'], {
      key: 'newEmptyFilter'
    })
    expect(service).to.have.callCount(0)
    expect(Tree.getNode(['root', 'newEmptyFilter'])).to.exist
    await Tree.remove(['root', 'newEmptyFilter'])
    expect(service).to.have.callCount(0)
    expect(Tree.getNode(['root', 'newEmptyFilter'])).to.not.exist

    await Tree.add(['root'], {
      key: 'newFilterWithValueForRemoveTest',
      data: {
        values: 'asdf'
      }
    })
    expect(service).to.have.callCount(1)
    expect(Tree.getNode(['root', 'newFilterWithValueForRemoveTest'])).to.exist
    await Tree.remove(['root', 'newFilterWithValueForRemoveTest'])
    expect(Tree.getNode(['root', 'newFilterWithValueForRemoveTest'])).to.not.exist
    expect(service).to.have.callCount(2)
    expect(reactor).to.have.callCount(4)
    expect(treeUtils.lookup(['newEmptyFilter'], reactor.getCall(0).args[0])).to.deep.equal({
      key: 'newEmptyFilter',
      path: 'root->newEmptyFilter',
    })
    expect(treeUtils.lookup(['newEmptyFilter'], reactor.getCall(1).args[0])).to.deep.equal({
      key: 'newEmptyFilter',
      path: 'root->newEmptyFilter',
      hasValue: false
    })
    expect(_.omit(['lastUpdateTime'], treeUtils.lookup(['newEmptyFilter'], reactor.getCall(2).args[0]))).to.deep.equal({
      key: 'newEmptyFilter',
      path: 'root->newEmptyFilter',
      hasValue: false,
      updating: true,
      markedForUpdate: false
    })
    expect(treeUtils.lookup(['newFilterWithValueForRemoveTest'], reactor.getCall(0).args[0])).to.equal(undefined)
    expect(treeUtils.lookup(['newFilterWithValueForRemoveTest'], reactor.getCall(1).args[0])).to.deep.equal({
      key: 'newFilterWithValueForRemoveTest',
      path: 'root->newFilterWithValueForRemoveTest',
      data: {
        values: 'asdf'
      },
    })
    expect(treeUtils.lookup(['newFilterWithValueForRemoveTest'], reactor.getCall(2).args[0])).to.deep.equal({
      key: 'newFilterWithValueForRemoveTest',
      path: 'root->newFilterWithValueForRemoveTest',
      hasValue: true,
      data: {
        values: 'asdf'
      },
    })
    expect(_.omit(['lastUpdateTime'], treeUtils.lookup(['newFilterWithValueForRemoveTest'], reactor.getCall(3).args[0]))).to.deep.equal({
      key: 'newFilterWithValueForRemoveTest',
      path: 'root->newFilterWithValueForRemoveTest',
      hasValue: true,
      markedForUpdate: false,
      updating: true,
      data: {
        values: 'asdf'
      },
    })
    disposer()
  })
})
