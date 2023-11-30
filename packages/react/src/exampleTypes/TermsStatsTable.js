import _ from 'lodash/fp.js'
import F from 'futil'
import React from 'react'
import { observer } from 'mobx-react'
import { contexturify } from '../utils/hoc.js'
import { withTheme } from '../utils/theme.js'
import { ExpandableTable, Column, Flex } from '../greyVest/index.js'
import { setDisplayName } from 'react-recompose'

let toolBarStyle = { justifyContent: 'space-between', alignItems: 'center' }
let SimpleLabel = ({ text }) => (
  <label style={{ paddingRight: '5px' }}>{text}</label>
)
let SimpleFilter = _.flow(
  setDisplayName('SimpleFilter'),
  observer,
  withTheme
)(({ theme: { TextInput }, ...props }) => (
  <Flex style={{ ...toolBarStyle, width: '75%' }}>
    <SimpleLabel text="Filter:" />
    <TextInput {...props} />
  </Flex>
))

let SelectSize = _.flow(
  setDisplayName('SelectSize'),
  observer,
  withTheme
)(
  ({
    node,
    tree,
    options = [10, 25, 50, 100, 500, 1000],
    theme: { Select },
  }) => (
    <Flex style={{ marginLeft: 12, ...toolBarStyle }}>
      <SimpleLabel text="Size:" />
      <Select
        onChange={(e) => {
          tree.mutate(node.path, { size: e.target.value })
        }}
        value={_.getOr(25, 'size', node)}
        placeholder={null}
        style={{ width: '100px' }}
        options={_.map((x) => ({ value: x, label: x }), options)}
      />
    </Flex>
  )
)

let TermsStatsTable = ({
  node,
  criteria,
  criteriaField,
  criteriaFieldLabel = '',
  criteriaGetValue = _.identity,
  tree,
  children,
  sizeOptions,
  limitedResults,
  theme: { Button },
  ...props
}) => (
  <div>
    <Flex style={{ ...toolBarStyle, margin: '0 8px' }}>
      <SimpleFilter {...F.domLens.value(tree.lens(node.path, 'filter'))} />
      <SelectSize node={node} tree={tree} options={sizeOptions} />
    </Flex>
    <ExpandableTable
      {...{
        ...props,
        children: criteria
          ? [
              ..._.compact(children),
              <Column
                key="checkbox"
                label={criteriaFieldLabel}
                expand={{
                  display: (value, record) => (
                    <div>
                      <Button
                        onClick={async () => {
                          let field =
                            criteriaField || node.key_field || node.groupField
                          let filter =
                            criteria &&
                            _.find({ field }, tree.getNode(criteria).children)
                          if (!filter || _.get('mode', filter) === 'exclude') {
                            await tree.add(criteria, {
                              field,
                              type: 'facet',
                            })
                            filter = _.findLast(
                              { field },
                              tree.getNode(criteria).children
                            )
                          }
                          await tree.mutate(filter.path, {
                            mode: 'include',
                            values: _.uniq([
                              ..._.getOr([], 'values', filter),
                              criteriaGetValue(record.key),
                            ]),
                          })
                        }}
                      >
                        Add as Filter
                      </Button>
                    </div>
                  ),
                }}
              />,
            ]
          : _.compact(children),
      }}
      data={node.context?.terms ?? node.context?.results}
      sortField={node.order}
      sortDir={node.sortDir}
      columnSort={(column) => {
        if (column.field !== 'key' && column.enableSort) {
          tree.mutate(node.path, {
            order: column.field,
            sortDir: column.sortDir,
          })
        }
      }}
      blankRows={limitedResults}
      pageSize={node.size}
    />
  </div>
)

export default contexturify(TermsStatsTable)
