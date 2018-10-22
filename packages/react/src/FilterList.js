import React from 'react'
import _ from 'lodash/fp'
import { observer, inject } from 'mobx-react'
import { Dynamic } from './layout'
import InjectTreeNode from './utils/injectTreeNode'

export let Label = inject(_.pick('tree'))(
  observer(({ tree, node, ...x }) => (
    <div
      className='filter-field-label'
      style={{ cursor: 'pointer', display: 'flex', justifyContent:'space-between' }}
      onClick={() => tree && node && tree.mutate(node.path, { paused: !node.paused })}
    >
      <span {...x} />
      {tree && node && <span className='filter-field-label-icon'>{node.paused ? '◀' : '▼'}</span>}
    </div>
  ))
)
Label.displayName = 'Label'

export let FieldLabel = InjectTreeNode(
  observer(({ node, node: { field } = {}, fields }) => (
    <Label node={node}>{_.get([field, 'label'], fields)}</Label>
  ))
)
FieldLabel.displayName = 'FieldLabel'

export let FilterList = InjectTreeNode(
  observer(
    ({ node, typeComponents: types, fields, mapNodeToProps = _.noop }) => (
      <div>
        {_.map(
          child => (
            <div key={child.path} className="filter-list-item">
              <FieldLabel node={child} fields={fields} />
              {!child.paused && (
                <div className='filter-list-item-contents'>
                  <Dynamic
                    component={types[child.type]}
                    path={child.path.slice()}
                    {...mapNodeToProps(child, fields, types)}
                  />
                </div>
              )}
            </div>
          ),
          node.children
        )}
      </div>
    )
  )
)
FilterList.displayName = 'FilterList'
