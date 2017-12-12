import _ from 'lodash/fp'
import chai from 'chai'
const expect = chai.expect
import { validate } from '../src/validation'

describe('validateGroup', () => {
  it('should not change the path of children', async () => {
    // Background:
    // The `mutate` action does this:
    //   let target = getNode(path)
    //   let previous = snapshot(_.omit('children', target))
    //   // ...
    //   dispatch({ previous, ...
    // Dispatch then calls to:
    //   await process(event, hasValueMap, validateGroup, ...
    // Which calls to reactor's standardChange, which does:
    //   /* ... */ await validateGroup(previous)) /* ... */
    // Which then, at validateGroup, calls:
    //   _.some(null, await validateLeaves(flatLeaves(flattenTree(child))))
    // Which ends up changing the path of the children unless we do this in flattenTree:
    //   if (!node.path) setPath(node, ...args)
    // Which was introduced in: https://github.com/smartprocure/contexture-client/pull/6
    let tree = {
      key: 'root',
      children: [
        {
          key: 'searchRoot',
          path: 'root->searchRoot',
          children: [
            {
              key: 'first',
              path: 'root->searchRoot->first',
            },
          ],
        },
      ],
    }
    await validate(_.constant(true)).validateGroup(tree.children[0])
    expect(tree.children[0].children[0]).to.deep.equal({
      key: 'first',
      path: 'root->searchRoot->first',
      hasValue: true,
    })
  })
})
