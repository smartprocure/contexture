import _ from 'lodash/fp'
import React from 'react'
import { contexturify } from './utils/hoc'
import { newNodeFromField } from './utils/search'
import { withNamedTheme } from './utils/theme'

export let fieldsToOptions = _.map(x => ({ value: x.field, ...x }))

let getGroupFields = node => _.map('field', _.getOr([], 'children', node))

let FilterAdder = ({
  tree,
  node,
  path,
  fields,
  theme: { ModalPicker },
  uniqueFields,
  label = 'Add Custom Filter',
}) => {
  let options = fieldsToOptions(fields)
  if (uniqueFields) {
    options = _.reject(x => _.includes(x.field, getGroupFields(node)), options)
  }
  return (
    <ModalPicker
      options={options}
      onChange={field => tree.add(path, newNodeFromField({ field, fields }))}
      label={label}
    />
  )
}

export default _.flow(
  contexturify,
  withNamedTheme('FilterAdder')
)(FilterAdder)
