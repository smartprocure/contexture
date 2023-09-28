import _ from 'lodash/fp.js'
import F from 'futil'
import {
  maybeAppend,
  writeTreeNode,
  transmuteTree,
  virtualConcat,
} from './futil.js'
import { simplifyBucket } from './elasticDSL.js'

describe('futil candidates', () => {
  it('maybeAppend should work', () => {
    expect(maybeAppend('.txt', 'file')).toEqual('file.txt')
    expect(maybeAppend('.txt', 'file.txt')).toEqual('file.txt')
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
    let result = Tree.toArrayBy((node) => node.key, tree)
    expect(result).toEqual(expected)

    // Mapping works with new write property!
    let modifiedTree = Tree.map(
      (node) => ({
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
    let modifiedResult = Tree.toArrayBy((node) => node.key, modifiedTree)
    expect(modifiedResult).toEqual(modifiedExpected)
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
    let traverseTarget = (node) => {
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
    expect(depthAdded).toEqual({
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
    expect(bucketSimplified).toEqual({
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
  it('virtualConcat', () => {
    let arr1 = [0, 1, 2, 3]
    let arr2 = [4, 5, 6, 7]
    let arr = virtualConcat(arr1, arr2)

    expect(arr[5]).toBe(5)
    expect(arr.length).toBe(8)
    arr[5] = 'a'
    expect(arr2[1]).toBe('a') // underlying array is mutated
    expect(_.toPairs(arr)).toEqual([
      ['0', 0],
      ['1', 1],
      ['2', 2],
      ['3', 3],
      ['4', 4],
      ['5', 'a'],
      ['6', 6],
      ['7', 7],
    ])
    expect(JSON.stringify(arr)).toBe('[0,1,2,3,4,"a",6,7]')
    // F.eachIndexed((x, i) => {
    //   console.log(x, i) // iterates over all values
    // }, arr)
  })
  it('transmuteTree should simplify groups.buckets in tree with rows and columns', () => {
    let tree = {
      key: 'root',
      groups: {
        buckets: [
          {
            key: 'row1',
            groups: {
              buckets: [{ key: 'thing' }, { key: 'thing2' }],
            },
            columns: {
              buckets: [
                { key: 'innermost' },
                { key: 'inner2', min: { value: 12 }, some_value: 3 },
              ],
            },
          },
        ],
      },
    }

    let traverseSource = (node) =>
      virtualConcat(
        _.getOr([], 'groups.buckets', node),
        _.getOr([], 'columns.buckets', node)
      )

    let traverseTarget = (node) => virtualConcat(node.groups, node.columns)

    let cleanup = (node) => {
      // groups needs to be the right length or virtualConcat will put everything in columns since the cut off for determining when to go to arr2 would be 0 if arr1 is size 0
      if (node.groups && !_.isArray(node.groups))
        node.groups = Array(_.get('groups.buckets.length', node))
      if (node.columns && !_.isArray(node.columns)) node.columns = []
    }
    // Goal here is to map the tree from one structure to another
    // goal is to keep _nodes_ the same, but write back with different (dynamic) traversal
    //   e.g. valuefilter.groups.buckets -> groups, groups.buckets -> groups
    let simplifyGroups = transmuteTree(traverseSource, traverseTarget, cleanup)

    // More realistic test that also maps min.value -> min
    let bucketSimplified = simplifyGroups(simplifyBucket, tree)

    expect(bucketSimplified).toEqual({
      key: 'root',
      groups: [
        {
          key: 'row1',
          groups: [{ key: 'thing' }, { key: 'thing2' }],
          columns: [
            { key: 'innermost' },
            { key: 'inner2', min: 12, someValue: 3 },
          ],
        },
      ],
    })
  })
})
