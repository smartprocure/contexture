import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import * as lib from '../src'
const expect = chai.expect
chai.use(sinonChai)

describe('lib', () => {
  let tree = {
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
            data: {
              values: ['City of Deerfield'],
            },
            config: {
              size: 24,
            },
          },
          {
            key: 'mainQuery',
            type: 'query',
            data: {
              query: 'cable internet~',
            },
          },
          {
            key: 'noValue',
            type: 'facet',
            data: {
              values: [],
            },
          },
          {
            key: 'uselessGroup',
            join: 'and',
            children: [
              {
                key: 'uselessChild',
                type: 'facet',
                data: {
                  values: [],
                },
              },
            ],
          },
        ],
      },
    ],
  }
  describe('should generally work', () => {
    // TODO: make these generally self contained - some rely on previous test runs
    let tree = {
      key: 'root',
      join: 'and',
      children: [
        {
          key: 'filter',
        },
        {
          key: 'results',
        },
      ],
    }
    let service = sinon.spy(() => ({
      data: {
        key: 'root',
        children: [
          {
            key: 'results',
            context: {
              count: 1,
              results: [
                {
                  title: 'some result',
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
      },
    }))
    let Tree = lib.ContextTree(tree, service)
    it('should generally mutate', async () => {
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
            data: {
              values: ['a'],
            },
          },
          {
            key: 'results',
          },
        ],
      })
    })
    it('should remove filterOnly nodes with no value', async () => {
      service.reset()
      await Tree.mutate(['root', 'filter'], {
        config: {
          size: 10,
        },
      })
      expect(service).to.have.callCount(1)
      let [dto, now] = service.getCall(0).args
      // Should omit `results`
      expect(dto).to.deep.equal({
        key: 'root',
        join: 'and',
        children: [
          {
            key: 'filter',
            data: {
              values: ['a'],
            },
            config: {
              size: 10,
            },
            lastUpdateTime: now,
          },
        ],
      })
    })
    it('should block blank searches', async () => {
      service.reset()
      await Tree.mutate(['root', 'filter'], {
        data: {
          values: [],
        },
      })
      expect(service).to.have.callCount(0)
      Tree.getNode(['root']).allowBlank = true
      await Tree.mutate(['root', 'filter'], {
        data: {
          values: [],
        },
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
      Tree.getNode(['root', 'filter']).data = {
        values: ['real val'],
      }
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
      })
      expect(service).to.have.callCount(0)
      await Tree.add(['root'], {
        key: 'newFilterWithValue',
        data: {
          values: 'asdf',
        },
      })
      expect(service).to.have.callCount(1)
    })
    it('should support remove', async () => {
      service.reset()
      await Tree.add(['root'], {
        key: 'newEmptyFilter',
      })
      expect(service).to.have.callCount(0)
      expect(Tree.getNode(['root', 'newEmptyFilter'])).to.exist
      await Tree.remove(['root', 'newEmptyFilter'])
      expect(service).to.have.callCount(0)
      expect(Tree.getNode(['root', 'newEmptyFilter'])).to.not.exist

      await Tree.add(['root'], {
        key: 'newFilterWithValueForRemoveTest',
        data: {
          values: 'asdf',
        },
      })
      expect(service).to.have.callCount(1)
      expect(Tree.getNode(['root', 'newFilterWithValueForRemoveTest'])).to.exist
      await Tree.remove(['root', 'newFilterWithValueForRemoveTest'])
      expect(Tree.getNode(['root', 'newFilterWithValueForRemoveTest'])).to.not
        .exist
      expect(service).to.have.callCount(2)
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
      await Tree.mutate(['root', 'filter'], {
        config: {
          size: 42,
        },
      })
      expect(service).to.have.callCount(1)
      expect(Tree.getNode(['root', 'filter']).paused).to.be.true
      expect(Tree.getNode(['root', 'filter']).missedUpdate).to.be.true
      // Unpause here should trigger this to run
      await Tree.mutate(['root', 'filter'], {
        paused: false,
      })
      expect(service).to.have.callCount(2)
      expect(Tree.getNode(['root', 'filter']).paused).to.be.false
      expect(Tree.getNode(['root', 'filter']).missedUpdate).to.be.false
    })
    it('should handle groups being paused')
  })
  it('should throw if no service is provided', async () => {
    let Tree = lib.ContextTree({
      key: 'root',
      children: [
        {
          key: 'filter',
        },
        {
          key: 'results',
        },
      ],
    })
    try {
      await Tree.mutate(['root', 'filter'], {
        data: {
          values: ['cable'],
        },
      })
    } catch (e) {
      expect(e.message).to.equal('No update service provided!')
      return
    }
    throw Error('Should have thrown')
  })
  // it('should ignore searches where everything is filterOnly', () => {
  //   let Tree = lib.contextTree({
  //     key: 'root',
  //     children: [{
  //       key:'filter'
  //     }, {
  //       key: 'results'
  //     }]
  //   }),

  // })
  it('should work', async () => {
    let service = sinon.spy(() => ({ data: {} }))
    let Tree = lib.ContextTree(tree, service)

    await Tree.mutate(['root', 'criteria', 'mainQuery'], {
      data: {
        query: 'cable',
      },
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
              data: {
                values: ['City of Deerfield'],
              },
              config: {
                size: 24,
              },
              filterOnly: true,
            },
            {
              key: 'mainQuery',
              type: 'query',
              data: {
                query: 'cable',
              },
              filterOnly: true,
            },
          ],
        },
      ],
    })
  })
  it('should subscribe and unsubscribe', async () => {
    let subscriber = sinon.spy()
    let Tree = lib.ContextTree(
      {
        key: 'root',
        children: [
          {
            key: 'filter',
          },
          {
            key: 'results',
          },
        ],
      },
      () => ({
        data: {
          key: 'root',
          children: [
            {
              key: 'results',
              context: {
                results: [
                  {
                    a: 1,
                  },
                ],
              },
            },
          ],
        },
      })
    )
    let subscription = Tree.subscribe(subscriber, { type: 'update' })
    await Tree.mutate(['root', 'filter'], {
      data: {
        value: 'as',
      },
    })
    expect(subscriber).to.have.callCount(1)
    let { path, type, value } = subscriber.getCall(0).args[0]
    expect(path).to.deep.equal(['root', 'results'])
    expect(type).to.equal('update')
    expect(value).to.deep.equal({
      context: {
        results: [
          {
            a: 1,
          },
        ],
      },
    })
    subscription()
    await Tree.mutate(['root', 'filter'], {
      data: {
        value: 'as',
      },
    })
    expect(subscriber).to.have.callCount(1)
    Tree.subscribe(subscriber, { type: 'update' })
    await Tree.mutate(['root', 'filter'], {
      data: {
        value: 'as',
      },
    })
    expect(subscriber).to.have.callCount(2)
  })
})
