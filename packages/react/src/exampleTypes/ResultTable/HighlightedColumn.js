import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil'
import { observer } from 'mobx-react'
import { getResults } from '../../utils/schema'
import { withTheme } from '../../utils/theme'

let labelForField = (schema, field) =>
  _.getOr(field, 'label', _.find({ field }, schema))

let HighlightedColumn = ({
  node,
  results = _.result('slice', getResults(node)),
  additionalFields = _.result('0.additionalFields.slice', results),
  schema,
  Cell = 'td',
  theme: { Modal, Table },
}) => {
  let viewModal = React.useState(false)
  return _.isEmpty(additionalFields) ? (
    <Cell key="additionalFields" />
  ) : (
    <Cell key="additionalFields">
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
        onClick={e => {
          e.preventDefault()
          F.on(viewModal)()
        }}
      >
        Matched {_.size(additionalFields)} other field(s)
      </button>
    </Cell>
  )
}

export default _.flow(
  observer,
  withTheme
)(HighlightedColumn)
