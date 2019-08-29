import _ from 'lodash/fp'
import React from 'react'
import { contexturify } from './utils/hoc'
import { newNodeFromField } from './utils/search'
import { withNamedTheme } from './utils/theme'
import { ModalPicker } from './purgatory'
import { Flex } from './greyVest'

export let fieldsToOptions = _.map(x => ({ value: x.field, ...x }))

let getGroupFields = node => _.map('field', _.getOr([], 'children', node))

let FilterAdder = ({
  tree,
  node,
  path,
  fields,
  theme: { Icon },
  uniqueFields,
}) => {
  let options = fieldsToOptions(fields)
  if (uniqueFields) {
    options = _.reject(x => _.includes(x.field, getGroupFields(node)), options)
  }
  let Label = (
    <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
      Add Custom Filter
      <Icon style={{ opacity: 0.4 }} icon="FilterAdd" />
    </Flex>
  )
  return (
    <ModalPicker
      options={options}
      onChange={field => tree.add(path, newNodeFromField({ field, fields }))}
      label={Label}
    />
  )
}

export default _.flow(
  contexturify,
  withNamedTheme('FilterAdder')
)(FilterAdder)
