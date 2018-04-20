import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import { Flex } from '../layout/Flex'
import injectTreeNode from '../utils/injectTreeNode'

// For futil-js
let toggleElement = (check, val, arr = []) =>
  (check ? _.pull : F.push)(val, arr)

export default injectTreeNode(
  observer(({ tree, node, hide = {}, TextInput='input' }) => (
    <div>
      {!hide.facetFilter && (
        <TextInput
          value={node.optionsFilter}
          onChange={e =>
            tree.mutate(node.path, { optionsFilter: e.target.value })
          }
          placeholder="Find..."
        />
      )}
      {_.map(({ name, count }) => {
        let checked = _.includes(name, node.values)
        return (
          <Flex
            key={name}
            style={{ justifyContent: 'space-between', alignItems: 'baseline' }}
          >
            <input
              type="checkbox"
              onChange={() => {
                tree.mutate(node.path, {
                  values: toggleElement(checked, name, node.values),
                })
              }}
              checked={checked}
            />
            <div style={{ flex: 2, paddingLeft: '5px', paddingRight: '5px' }}>
              {name}
            </div>
            <div>{count}</div>
          </Flex>
        )
      }, _.get('context.options', node))}
    </div>
  )),
  exampleTypes.facet
)
