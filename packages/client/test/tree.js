import { flattenTree, keyPath } from '../src/util/tree'
import _ from 'lodash/fp'
import chai from 'chai'
const expect = chai.expect

describe('tree', () => {
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
        join: 'and',
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
        ],
      },
    ],
  }
  it('should find', () => {
    let findTest = _.find(keyPath('test'))
    var test = findTest([
      {
        key: 'a',
        val: 1,
      },
      {
        key: 'test',
        val: 2,
      },
    ])
    expect(test).to.deep.equal({
      key: 'test',
      val: 2,
    })
  })
  it('should maintain references in flattened tree', () => {
    let flat = flattenTree(tree)
    
    flat['root->criteria'].join = 'or'
    expect(tree.children[1].join).to.equal('or')
    
    tree.children[1].join = 'and'
    expect(flat['root->criteria'].join).to.equal('and')
  })
})
