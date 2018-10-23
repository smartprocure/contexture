import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
import ExpandableTable, { Column } from '../layout/ExpandableTable'

let TermsStatsTable = injectTreeNode(
  observer(
    ({
      node,
      criteria,
      tree,
      children,
      MoreControls = 'div',
      Input = 'input',
      ...props
    }) => (
      <div>
        <div>
          Filter:
          <Input
            type="text"
            {...F.domLens.value(tree.lens(node.path, 'filter'))}
          />
        </div>
        <ExpandableTable
          {...{
            ...props,
            children: criteria
              ? [
                  ...children,
                  <Column
                    label="Controls"
                    expand={{
                      display: (value, record) => (
                        <div>
                          <button
                            onClick={async () => {
                              let field = node.key_field
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
                                values: [record.key],
                              })
                            }}
                          >
                            Add as Filter
                          </button>
                          <MoreControls />
                        </div>
                      ),
                    }}
                  />,
                ]
              : children,
          }}
          data={node.context.terms}
        />
      </div>
    )
  ),
  exampleTypes.TermsStats
)
TermsStatsTable.displayName = 'TermsStatsTable'

export default TermsStatsTable
