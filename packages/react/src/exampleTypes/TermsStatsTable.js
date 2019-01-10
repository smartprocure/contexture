import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
import ExpandableTable, { Column } from '../layout/ExpandableTable'

let SimpleFilter = observer(({ Input = 'input', ...props }) => (
  <div>
    Filter:
    <Input type="text" {...props} />
  </div>
))

let TermsStatsTable = injectTreeNode(
  observer(
    ({
      node,
      criteria,
      criteriaField,
      criteriaGetValue = _.identity,
      tree,
      children,
      Button,
      MoreControls = 'div',
      Input = 'input',
      Filter = SimpleFilter,
      ...props
    }) => (
      <div>
        <Filter
          Input={Input}
          {...F.domLens.value(tree.lens(node.path, 'filter'))}
        />
        <ExpandableTable
          {...{
            ...props,
            children: criteria
              ? [
                  ..._.compact(children),
                  <Column
                    label="Controls"
                    expand={{
                      display: (value, record) => (
                        <div>
                          <Button
                            onClick={async () => {
                              let field = criteriaField || node.key_field
                              let filter =
                                criteria &&
                                _.find(
                                  { field },
                                  tree.getNode(criteria).children
                                )

                              if (!filter) {
                                await tree.add(criteria, {
                                  key: _.uniqueId('add'),
                                  field,
                                  type: 'facet',
                                })
                                filter = _.find(
                                  { field },
                                  tree.getNode(criteria).children
                                )
                              }

                              await tree.mutate(filter.path, {
                                mode: 'include',
                                values: [criteriaGetValue(record.key)],
                              })
                            }}
                          >
                            Add as Filter
                          </Button>
                          <MoreControls />
                        </div>
                      ),
                    }}
                  />,
                ]
              : _.compact(children),
          }}
          data={node.context.terms}
          sortField={node.order}
          sortDir={node.sortDir}
          columnSort={column => {
            if (column.field !== 'key' && column.enableSort) {
              tree.mutate(node.path, {
                order: column.field,
                sortDir:
                  node.order === column.field && node.sortDir === 'asc'
                    ? 'desc'
                    : 'asc',
              })
            }
          }}
        />
      </div>
    )
  ),
  exampleTypes.TermsStats
)
TermsStatsTable.displayName = 'TermsStatsTable'

export default TermsStatsTable
