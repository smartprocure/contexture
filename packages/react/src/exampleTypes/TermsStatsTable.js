import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
import ExpandableTable, { Column } from '../layout/ExpandableTable'
import { applyDefaults, inferSchema } from '../utils/schema'

let TermsStatsTable = injectTreeNode(
  observer(({ infer, fields, node, criteria, tree, children, ...props }) => (
    <div>
      <div>
        Filter:
        <input
          type="text"
          value={node.filter}
          onChange={async e => {
            await tree.mutate(node.path, { filter: e.target.value })
            // TODO: This seems like a contexture-client issue. We shouldn't need this line:
            await tree.refresh(node.path)
          }}
          />
      </div>
      <ExpandableTable {...{ ...props, children: [
        ...children,
        <Column
          label="Controls"
          expand={{
            display: (value, record) => <div>
              <button onClick={async () => {
                // TODO: Could this be smaller?
                let schema = _.flow(
                  _.merge(infer && inferSchema(node)),
                  applyDefaults,
                  _.values,
                  _.orderBy('order', 'desc')
                )(fields)

                let field = node.key_field
                let filter = criteria && _.find({ field }, tree.getNode(criteria).children)

                if (!filter) {
                  await tree.add(criteria, {
                    key: _.uniqueId('add'),
                    field,
                    type: _.find({ field }, schema).typeDefault,
                  })
                  filter = _.find({ field }, tree.getNode(criteria).children)
                }

                await tree.mutate(filter.path, {
                  values: [..._.castArray(filter.values.slice()), record.key]
                })
              }}>Add as Filter</button>
              <button>Open Profile (TODO)</button>
            </div>
          }}
          />
      ] }} data={node.context.terms} />
    </div>
  )),
  exampleTypes.TermsStats
)
TermsStatsTable.displayName = 'TermsStatsTable'

export default TermsStatsTable
