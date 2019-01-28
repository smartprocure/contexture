import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Dynamic } from './layout'
import InjectTreeNode from './utils/injectTreeNode'
import DefaultIcon from './DefaultIcon'
import { bdJoin } from './styles/generic'

let LabelState = ({ tree }) => ({
  tree,
  state: observable({ refreshHover: false }),
})

export let Label = inject(LabelState)(
  observer(({ tree, node, Icon, state, ...x }) => (
    <div
      className={`filter-field-label ${
        _.get('hasValue', node) ? 'filter-field-has-value' : ''
      }`.trim()}
      style={{
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
      }}
      onClick={() =>
        tree && node && tree.mutate(node.path, { paused: !node.paused })
      }
    >
      <span {...x} />
      {tree &&
        node && (
          <span className="filter-field-label-icon">
            {!node.updating &&
              !!node.hasValue &&
              tree.disableAutoUpdate &&
              // find if any nodes in the tree are marked for update (i.e. usually nodes are marked for update because they react to "others" reactor)
              _.some(
                treeNode => treeNode !== node && treeNode.markedForUpdate,
                F.treeToArray(_.get('children'))(tree.tree)
              ) && (
                <Icon
                  icon="Refresh"
                  className={`filter-field-icon-refresh ${
                    state.refreshHover ? 'filter-field-icon-hover' : ''
                  }`.trim()}
                  onMouseOver={() => (state.refreshHover = true)}
                  onMouseOut={() => (state.refreshHover = false)}
                  onClick={e => {
                    e.stopPropagation()
                    tree.triggerUpdate()
                  }}
                />
              )}
            <Icon
              icon={node.paused ? 'FilterListExpand' : 'FilterListCollapse'}
            />
          </span>
        )}
    </div>
  ))
)
Label.displayName = 'Label'

export let FieldLabel = InjectTreeNode(
  observer(({ node, node: { field } = {}, fields, Icon, label }) => (
    <Label node={node} Icon={Icon}>
      {label || _.get([field, 'label'], fields) || field}
    </Label>
  ))
)
FieldLabel.displayName = 'FieldLabel'

export let DefaultMissingTypeComponent = InjectTreeNode(({ node = {} }) => (
  <div>
    Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
  </div>
))

export let FilterList = InjectTreeNode(
  observer(
    ({
      node,
      typeComponents: types,
      fields,
      mapNodeToProps = _.noop,
      mapNodeToLabel = _.noop,
      Icon = DefaultIcon,
      className,
      style,
      MissingTypeComponent = DefaultMissingTypeComponent,
    }) => (
      <div style={style} className={className}>
        {_.map(
          child =>
            child.children ? (
              <FilterList
                key={child.path}
                node={child}
                typeComponents={types}
                fields={fields}
                mapNodeToProps={mapNodeToProps}
                mapNodeToLabel={mapNodeToLabel}
                Icon={Icon}
                className={'filter-list-group'}
                style={bdJoin(child)}
              />
            ) : (
              <div key={child.path} className="filter-list-item">
                <FieldLabel
                  node={child}
                  fields={fields}
                  Icon={Icon}
                  label={mapNodeToLabel(child, fields, types)}
                />
                {!child.paused && (
                  <div className="filter-list-item-contents">
                    <Dynamic
                      component={types[child.type] || MissingTypeComponent}
                      path={_.toArray(child.path)}
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
