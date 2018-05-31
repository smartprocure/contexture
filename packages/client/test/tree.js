import { flatten, encode, isParent } from '../src/util/tree'
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
  it('should maintain references in flattened tree', () => {
    let flat = flatten(tree)
    let path = encode(['root', 'criteria'])
    flat[path].join = 'or'
    expect(tree.children[1].join).to.equal('or')

    tree.children[1].join = 'and'
    expect(flat[path].join).to.equal('and')
  })
  it('should correctly answer isParent', () => {
    expect(isParent([1, 2, 3], [1, 2, 3, 4, 5])).to.be.true
    expect(isParent([1, 3, 2], [1, 2, 3, 4, 5])).to.be.false
    expect(isParent([2, 3], [1, 2, 3, 4, 5])).to.be.false
    expect(isParent([8, 2, 3], [1, 2, 3, 4, 5])).to.be.false
    expect(isParent([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])).to.be.false
  })
})
