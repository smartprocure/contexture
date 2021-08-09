import _ from 'lodash/fp'
import React from 'react'
import { contexturifyWithoutLoader } from './utils/hoc'
import { newNodeFromField } from './utils/search'
import { ModalPicker } from './purgatory'
import { Flex } from './greyVest'

export let fieldsToOptions = _.map(x => ({ value: x.field, ...x }))

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
  Picker = ModalPicker,
  theme: { Icon },
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
          _.each(({ field }) => tree.add(path, newNodeFromField({ field, fields })), changes)
        }
      }}
      label={Label}
    />
  )
}

export default contexturifyWithoutLoader(FilterAdder)
