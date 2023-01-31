import {
  applyDefaults,
  componentForType,
  schemaFieldProps,
} from './utils/schema.js'
import Component from './FilterButtonList.js'
import {
  tree,
  fields,
  nodeOverrides,
  types,
} from './queryWizard/stories/config.js'
import { mergeOverAll } from 'futil'
import { TypeMap } from './exampleTypes/index.js'
import _ from 'lodash/fp.js'

let mapNodeToDescription = (node, fields) => ({
  description: _.join(' ', [
    _.get([node.field, 'description'], fields) || node.description,
    _.get([node.type, 'description'], types),
  ]),
})

export default {
  component: Component,
  args: {
    tree,
    fields: applyDefaults(fields),
    mapNodeToProps: mergeOverAll([
      componentForType(TypeMap),
      schemaFieldProps(['label']),
      mapNodeToDescription,
      (node) => nodeOverrides[node.key],
    ]),
  },
}

export const Simple = {
  args: {
    path: ['root', 'step 1', 'foop'],
  },
}

export const WithFilterAdder = {
  args: {
    path: ['root', 'step 1', 'foop'],
    addFilters: 'Add Filters',
  },
}

export const WithNestedNodes = {
  args: {
    path: ['root'],
    addFilters: true,
  },
}
