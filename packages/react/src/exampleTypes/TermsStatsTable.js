import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { contexturify } from '../utils/hoc'
import { withTheme } from '../utils/theme'
import ExpandableTable, { Column } from '../greyVest/ExpandableTable'
import Flex from '../greyVest/Flex'

let toolBarStyle = { justifyContent: 'space-between', alignItems: 'center' }
let SimpleLabel = ({ text }) => (
  <label style={{ paddingRight: '5px' }}>{text}</label>
)
let SimpleFilter = _.flow(
  observer,
  withTheme
)(({ theme: { TextInput }, ...props }) => (
  <Flex style={{ ...toolBarStyle, width: '75%' }}>
    <SimpleLabel text="Filter:" />
    <TextInput {...props} />
  </Flex>
))
SimpleFilter.displayName = 'SimpleFilter'

let SelectSize = _.flow(
  observer,
  withTheme
)(
  ({
    node,
    theme: { Select },
    tree,
    options = [10, 25, 50, 100, 500, 1000],
  }) => (
    <Flex style={toolBarStyle}>
      <SimpleLabel text="Size:" />
      <Select
        onChange={e => {
          tree.mutate(node.path, { size: e.target.value })
        }}
        value={_.getOr(25, 'size', node)}
        placeholder={null}
        style={{ width: '100px' }}
        options={_.map(x => ({ value: x, label: x }), options)}
      />
    </Flex>
  )
)
let TermsStatsTable = _.flow(
  contexturify,
  withTheme
)(
  ({
    node,
    criteria,
    criteriaField,
    criteriaFieldLabel = '',
    criteriaGetValue = _.identity,
    tree,
    children,
    theme: { Button },
    MoreControls = 'div',
    Filter = SimpleFilter,
    sizeOptions,
    ...props
  }) => (
    <div>
      <Flex style={{ ...toolBarStyle, margin: 40, marginBottom: 0 }}>
        <Filter {...F.domLens.value(tree.lens(node.path, 'filter'))} />
        <SelectSize node={node} tree={tree} options={sizeOptions} />
      </Flex>
      <ExpandableTable
        {...{
          ...props,
          children: criteria
            ? [
                ..._.compact(children),
                <Column
                  label={criteriaFieldLabel}
                  expand={{
                    display: (value, record) => (
                      <div>
                        <Button
                          onClick={async () => {
                            let field = criteriaField || node.key_field
                            let filter =
                              criteria &&
                              _.find({ field }, tree.getNode(criteria).children)
                            if (
                              !filter ||
                              _.get('mode', filter) === 'exclude'
                            ) {
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
                              values: _.uniq([
                                ..._.getOr([], 'values', filter),
                                criteriaGetValue(record.key),
                              ]),
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
                node.order === column.field && node.sortDir === 'desc'
                  ? 'asc'
                  : 'desc',
            })
          }
        }}
      />
    </div>
  )
)
TermsStatsTable.displayName = 'TermsStatsTable'

export default TermsStatsTable
