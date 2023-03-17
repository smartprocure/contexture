import _ from 'lodash/fp.js'
import Component from './QueryWizard.js'
import { mergeOverAll } from 'futil'
import { componentForType, schemaFieldProps } from '../utils/schema.js'
import { TypeMap } from '../exampleTypes/index.js'
import { tree, fields, types, nodeOverrides } from './stories/config.js'

let mapNodeToDescription = (types) => (node, fields) => ({
  description: _.join(' ', [
    _.get([node.field, 'description'], fields) || node.description,
    _.get([node.type, 'description'], types),
  ]),
})

export default {
  component: Component,
  args: {
    tree,
    path: ['root'],
    fields,
    title: 'Movies',
    mapNodeToProps: mergeOverAll([
      componentForType(TypeMap),
      schemaFieldProps(['label']),
      mapNodeToDescription(types),
      (node) => nodeOverrides[node.key],
    ]),
  },
}

export const QueryWizard = {}
