import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { getRecord, getResults } from '../../utils/schema'
import HighlightedColumn from './HighlightedColumn'

// Separate this our so that the table root doesn't create a dependency on results to headers won't need to rerender on data change
let TableBody = ({
  node,
  visibleFields,
  fields,
  hiddenFields,
  schema,
  Row = 'tr',
  getRowKey = _.get('_id'),
  stickyFields,
}) => (
  <tbody>
    {!!getResults(node).length &&
      _.map(
        x => (
          <Row
            key={getRowKey(x)}
            record={getRecord(x)}
            {...{ fields, visibleFields, hiddenFields }}
          >
            {_.map(
              ({ field, display = x => x, Cell = 'td' }) => (
                <Cell
                  key={field}
                  className={_.contains(stickyFields, field) ? 'sticky' : null}
                >
                  {display(_.get(field, getRecord(x)), getRecord(x))}
                </Cell>
              ),
              visibleFields
            )}
            {node.showOtherMatches && (
              <HighlightedColumn
                {...{
                  node,
                  additionalFields: _.result('additionalFields.slice', x),
                  schema,
                }}
              />
            )}
          </Row>
        ),
        getResults(node)
      )}
  </tbody>
)

export default observer(TableBody)
