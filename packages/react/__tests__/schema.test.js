import { componentForType } from '../src/utils/schema'
import { TypeMap, Facet } from '../src/exampleTypes'
import { UnmappedNodeComponent } from '../src/themes/base'

test('componentForType', () => {
  let mapNodeToComponent = componentForType(TypeMap)
  let defaultProps = { component: UnmappedNodeComponent } // for realism

  let node = { type: 'facet' }
  expect(mapNodeToComponent(node)).toEqual({ component: Facet })

  let unmappedNode = { type: 'little-teapot' }
  expect(mapNodeToComponent(unmappedNode)).toEqual(undefined)

  // merge test
  expect({ ...defaultProps, ...mapNodeToComponent(unmappedNode) }).toEqual({
    component: UnmappedNodeComponent,
  })
  expect({ ...defaultProps, ...mapNodeToComponent(node) }).not.toEqual({
    component: UnmappedNodeComponent,
  })
})
