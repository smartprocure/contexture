import _ from 'lodash/fp.js'
import React from 'react'
import { defaultProps } from 'react-recompose'
import { contexturifyWithoutLoader } from './utils/hoc.js'
import { newNodeFromField } from './utils/search.js'
import { ModalPicker } from './purgatory/index.js'
import { Flex } from './greyVest/index.js'
import { fieldsToOptions } from './utils/fields.js'

let getGroupFields = (node) => _.map('field', _.getOr([], 'children', node))

export let unusedOptions = (fields, node) =>
  _.reject(
    (x) => _.includes(x.field, getGroupFields(node)),
    fieldsToOptions(fields)
  )

let FilterAdder = ({
  tree,
  node,
  path,
  fields,
  uniqueFields,
  Picker = defaultProps({ modalClassName: 'filter-adder' })(ModalPicker),
  ...props
}) => {
  let options = uniqueFields
    ? unusedOptions(fields, node)
    : fieldsToOptions(fields)
  let Label = (
    <Flex justifyContent="center" alignItems="center">
      Add Filter
    </Flex>
  )
  return (
    <Picker
      options={options}
      onChange={(changes) => {
        if (!_.isEmpty(changes)) {
          _.each(
            ({ field }) => tree.add(path, newNodeFromField({ field, fields })),
            changes
          )
        }
      }}
      label={Label}
      {...props}
    />
  )
}

export default contexturifyWithoutLoader(FilterAdder)
