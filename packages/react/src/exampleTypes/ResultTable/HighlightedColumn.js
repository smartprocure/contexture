import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { flattenObjectsNotArrays } from '../../utils/futil.js'
import { withTheme } from '../../utils/theme.js'

let labelForField = (schema, field) =>
  _.getOr(field, 'label', _.find({ field }, schema))

// Get fields that were highlighted but not included
export let getAdditionalHighlightedFields = ({ schema, record, node }) => {
  let fieldNames = _.difference(
    _.keys(flattenObjectsNotArrays(record._highlight)),
    [...node.include]
  )
  return _.pick(fieldNames, schema.fields)
}

let HighlightedColumn = ({ schema, node, record, theme: { Modal, Table } }) => {
  let viewModal = React.useState(false)
  let additionalFields = getAdditionalHighlightedFields({
    schema,
    record,
    node,
  })
  return _.isEmpty(additionalFields) ? null : (
    <>
      <Modal open={viewModal}>
        <h3>Other Matching Fields</h3>
        <Table>
          <tbody>
            {_.map(
              ({ label, value }) => (
                <tr key={label}>
                  <td>{labelForField(schema, label)}</td>
                  <td dangerouslySetInnerHTML={{ __html: value }} />
                </tr>
              ),
              additionalFields
            )}
          </tbody>
        </Table>
      </Modal>
      <button
        className="gv-link-button"
        onClick={(e) => {
          e.preventDefault()
          F.on(viewModal)()
        }}
      >
        Matched {_.size(additionalFields)} other field(s)
      </button>
    </>
  )
}

export default withTheme(HighlightedColumn)
