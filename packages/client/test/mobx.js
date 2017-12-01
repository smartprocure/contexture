import {flattenTree, keyPath} from '../src/util/tree'
import * as F from 'futil-js'
import _ from 'lodash/fp'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import * as lib from '../src'
import { observable, autorun, toJS } from 'mobx'
import util from 'util'
import Promise from 'bluebird'
const expect = chai.expect
chai.use(sinonChai)

let traverse = x => x && x.children && x.children.slice() // mobx needs slice
let treeUtils = F.tree(traverse, keyPath)
let ContextTreeMobx = (tree, service) => lib.ContextTree(tree, service, undefined, { snapshot: toJS })

describe('mobx', () => {
  let tree = observable({
    key: 'root',
    join: 'and',
    children: [{
      key: 'analysis',
      join: 'and',
      children: [{
        key: 'results',
        type: 'results'
      }]
    }, {
      key: 'criteria',
      join: 'or',
      children: [{
        key: 'agencies',
        field: 'Organization.Name',
        type: 'facet',
        data: {
          values: ['City of Deerfield']
        },
        config: {
          size: 24
        }
      }, {
        key: 'mainQuery',
        type: 'query',
        data: {
          query: 'cable internet~'
        }
      }, {
        key: 'noValue',
        type: 'facet',
        data: {
          values: []
        }
      }, {
        key: 'uselessGroup',
        join: 'and',
        children: [{
          key: 'uselessChild',
          type: 'facet',
          data: {
            values: []
          }
        }]
      }]
    }]
  })

  it('should work', async () => {
    let service = sinon.spy(x => ({data: {}}))
    let Tree = ContextTreeMobx(tree, service)

    await Tree.mutate(['root', 'criteria', 'mainQuery'], {
      data: {
        query: 'cable'
      }
    })

    expect(service).to.have.callCount(1)

    let [dto, now] = service.getCall(0).args

    expect(dto).to.deep.equal({
      key: 'root',
      join: 'and',
      children: [{
        key: 'analysis',
        join: 'and',
        children: [{
          key: 'results',
          type: 'results',
          lastUpdateTime: now
        }],
        lastUpdateTime: now
      }, {
        key: 'criteria',
        join: 'or',
        children: [{
          key: 'agencies',
          field: 'Organization.Name',
          type: 'facet',
          data: {
            values: ['City of Deerfield']
          },
          config: {
            size: 24
          },
          filterOnly: true
        }, {
          key: 'mainQuery',
          type: 'query',
          data: {
            query: 'cable'
          },
          filterOnly: true
        }]
      }]
    })
  })

  it('should subscribe and unsubscribe', async () => {
    let subscriber = sinon.spy()
    let Tree = lib.ContextTree({
      key: 'root',
      children: [{
        key: 'filter'
      }, {
        key: 'results'
      }]
    }, () => ({
      data: {
        key: 'root',
        children: [{
          key: 'results',
          context: {
            results: [{
              a: 1
            }]
          }
        }]
      }
    }))
    let subscription = Tree.subscribe(subscriber, {type:'update'})
    await Tree.mutate(['root', 'filter'], {
      data: {
        value: 'as'
      }
    })
    expect(subscriber).to.have.callCount(1)
    let {path, type, value} = subscriber.getCall(0).args[0]
    expect(path).to.deep.equal(['root', 'results'])
    expect(type).to.equal('update')
    expect(value).to.deep.equal({
      context: {
        results: [{
          a: 1
        }]
      }
    })
    subscription()
    await Tree.mutate(['root', 'filter'], {
      data: {
        value: 'as'
      }
    })
    expect(subscriber).to.have.callCount(1)
    Tree.subscribe(subscriber, {type:'update'})
    await Tree.mutate(['root', 'filter'], {
      data: {
        value: 'as'
      }
    })
    expect(subscriber).to.have.callCount(2)
  })

  describe('should generally work', () => {
    // TODO: make these generally self contained - some rely on previous test runs
    let tree = observable({
      key: 'root',
      join: 'and',
      children: [{
        key: 'filter',
        // TODO: Make sure we can add these properties later
        path: '',
        data: null
      }, {
        key: 'results'
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
    let disposer = autorun(() => reactor(toJS(tree)))
    after(disposer)

    it('should generally mutate', async () => {
      reactor.reset()
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
          lastUpdateTime: now
        }]
      })
      expect(reactor).to.have.callCount(1)
      // expect(_.omit('lastUpdateTime', treeUtils.lookup(['filter'], reactor.getCall(0).args[0]))).to.deep.equal({
      //   key: 'filter',
      //   path: 'root->filter',
      //   data: {
      //     values: ['a']
      //   },
      //   hasValue: true,
      //   updating: false
      // })
    })

    it('should update contexts', () => {
      expect(Tree.getNode(['root', 'results']).updating).to.be.false
      expect(Tree.getNode(['root', 'results']).context).to.deep.equal({
        count: 1,
        results: [{
          title: 'some result'
        }]
      })
    })

    it('should support add', async () => {
      service.reset()
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
    })

    it('should support remove', async () => {
      service.reset()
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
    })
  })
})
