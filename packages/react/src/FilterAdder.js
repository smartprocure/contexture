import _ from 'lodash/fp'
import React from 'react'
import { defaultProps } from 'react-recompose'
import { contexturifyWithoutLoader } from './utils/hoc'
import { newNodeFromField } from './utils/search'
import { ModalPicker } from './purgatory'
import { Flex } from './greyVest'
import { fieldsToOptions } from './utils/fields'

let getGroupFields = node => _.map('field', _.getOr([], 'children', node))

export let unusedOptions = (fields, node) =>
  _.reject(
    x => _.includes(x.field, getGroupFields(node)),
    fieldsToOptions(fields)
  )

let FilterAdder = ({
  tree,
  node,
  path,
  fields,
  uniqueFields,
  Picker = defaultProps({ modalClassName: 'filter-adder' })(ModalPicker),
  theme: { Icon },
  ...props
}) => {
  let options = uniqueFields
    ? unusedOptions(fields, node)
    : fieldsToOptions(fields)
  let Label = (
    <Flex justifyContent="center" alignItems="center">
      Add Custom Filter
      <Icon style={{ paddingLeft: 5 }} icon="FilterAdd" />
    </Flex>
  )
  return (
    <Picker
      options={options}
      onChange={changes => {
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
