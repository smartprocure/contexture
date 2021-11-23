let _ = require('lodash/fp')
let F = require('futil')
let { expect } = require('chai')
let {
  maybeAppend,
  writeTreeNode,
  transmuteTree,
} = require('../../src/utils/futil')
let { simplifyBucket } = require('../../src/utils/elasticDSL')

describe('futil canidiates', () => {
  it('maybeAppend should work', () => {
    expect(maybeAppend('.txt', 'file')).to.eql('file.txt')
    expect(maybeAppend('.txt', 'file.txt')).to.eql('file.txt')
  })
  it('writeTreeNode should support dynamic depth-dependent tree traversal and map', () => {
    let tree = {
      key: 'root',
      aggregations: {
        groups: {
          buckets: [
            {
              key: 'filteredTerms',
              valueFilter: {
                groups: {
                  buckets: [
                    {
                      key: 'nonFiltered',
                      groups: { buckets: [{ key: 'innermost' }] },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    }
    let traverse = (node, index, parents) => {
      let depth = parents.length
      if (depth === 0) return node.aggregations.groups.buckets
      if (depth === 1) return node.valueFilter.groups.buckets
      if (depth === 2) return node.groups.buckets
    }
    let Tree = F.tree(traverse, _.identity, writeTreeNode(traverse))
    let expected = ['root', 'filteredTerms', 'nonFiltered', 'innermost']
    let result = Tree.toArrayBy(node => node.key, tree)
    expect(result).to.eql(expected)

    // Mapping works with new write property!
    let modifiedTree = Tree.map(
      node => ({
        ...node,
        key: `${node.key}Modified`,
      }),
      tree
    )
    let modifiedExpected = [
      'rootModified',
      'filteredTermsModified',
      'nonFilteredModified',
      'innermostModified',
    ]
    let modifiedResult = Tree.toArrayBy(node => node.key, modifiedTree)
    expect(modifiedResult).to.eql(modifiedExpected)
  })
  it('transmuteTree should simplify groups.buckets in tree', () => {
    let tree = {
      key: 'root',
      aggregations: {
        groups: {
          buckets: [
            {
              key: 'filteredTerms',
              valueFilter: {
                groups: {
                  buckets: [
                    {
                      key: 'nonFiltered',
                      groups: {
                        buckets: [
                          { key: 'innermost' },
                          { key: 'inner2', min: { value: 12 }, some_value: 3 },
                          {
                            key: 'objectpart',
                            groups: {
                              buckets: {
                                pass: { skey: 'passinner' },
                                fail: { skey: 'failinner' },
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    }
    let traverseSource = (node, index, parents) => {
      let depth = parents.length
      if (depth === 0) return node.aggregations.groups.buckets
      if (depth === 1) return node.valueFilter.groups.buckets
      if (depth === 2) return node.groups.buckets
      if (depth === 3 && _.has('groups.buckets', node))
        return F.unkeyBy('key', node.groups.buckets)
    }
    let traverseTarget = node => {
      if (!_.isArray(node.groups)) node.groups = []
      return node.groups
    }
    let cleanupSourceTraversalPaths = (node, index, parents) => {
      let depth = parents.length
      // Clean up traveral paths
      if (depth === 0) delete node.aggregations
      if (depth === 1) delete node.valueFilter
      // not needed since groups is blown away by traversal
      if (depth === 2) delete node.groups.buckets
    }

    // Goal here is to map the tree from one structure to another
    // goal is to keep _nodes_ the same, but write back with different (dynamic) traversal
    //   e.g. valuefilter.groups.buckets -> groups, groups.buckets -> groups
    let simplifyGroups = transmuteTree(
      traverseSource,
      traverseTarget,
      cleanupSourceTraversalPaths
    )

    // mutation is required in preorder traversal, but not post order
    // return F.extendOn(node, { depth})
    // transform just adds depth as a test
    let depthAdded = simplifyGroups(
      (node, index, parents = []) => ({ depth: parents.length, ...node }),
      tree
    )
    expect(depthAdded).to.deep.equal({
      depth: 0,
      key: 'root',
      groups: [
        {
          depth: 1,
          key: 'filteredTerms',
          groups: [
            {
              depth: 2,
              key: 'nonFiltered',
              groups: [
                { depth: 3, key: 'innermost' },
                { depth: 3, key: 'inner2', min: { value: 12 }, some_value: 3 },
                {
                  depth: 3,
                  key: 'objectpart',
                  groups: [
                    { depth: 4, skey: 'passinner', key: 'pass' },
                    { depth: 4, skey: 'failinner', key: 'fail' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })

    // More realistic test that also maps min.value -> min
    let bucketSimplified = simplifyGroups(simplifyBucket, tree)
    expect(bucketSimplified).to.deep.equal({
      key: 'root',
      groups: [
        {
          key: 'filteredTerms',
          groups: [
            {
              key: 'nonFiltered',
              groups: [
                { key: 'innermost' },
                { key: 'inner2', min: 12, someValue: 3 },
                {
                  key: 'objectpart',
                  groups: [
                    { skey: 'passinner', key: 'pass' },
                    { skey: 'failinner', key: 'fail' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
  })
})
