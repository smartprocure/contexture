import _ from 'lodash/fp'
import React from 'react'
import { contexturifyWithoutLoader } from './utils/hoc'
import { newNodeFromField } from './utils/search'
import { ModalPicker } from './purgatory'
import { Flex } from './greyVest'

export let fieldsToOptions = _.map(x => ({ value: x.field, ...x }))

let getGroupFields = node => _.map('field', _.getOr([], 'children', node))

let FilterAdder = ({
  tree,
  node,
  path,
  fields,
  uniqueFields,
  Picker = ModalPicker,
  theme: { Icon },
}) => {
  let options = fieldsToOptions(fields)
  if (uniqueFields) {
    options = _.reject(x => _.includes(x.field, getGroupFields(node)), options)
  }
  let Label = (
    <Flex justifyContent="center" alignItems="center">
      Add Custom Filter
      <Icon style={{ paddingLeft: 5 }} icon="FilterAdd" />
    </Flex>
  )
  return (
    <Picker
      options={options}
      onChange={field => tree.add(path, newNodeFromField({ field, fields }))}
      label={Label}
    />
  )
}

export default contexturifyWithoutLoader(FilterAdder)
