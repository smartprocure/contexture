import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer, inject } from 'mobx-react'
import { Flex, Dynamic } from './layout'
import InjectTreeNode from './utils/injectTreeNode'
import DefaultIcon from './DefaultIcon'
import { bdJoin } from './styles/generic'

export let Label = inject(_.pick('tree'))(
  observer(({ tree, node, Icon, ...x }) => (
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
          <Flex
            className="filter-field-label-icon"
            style={{ alignItems: 'center' }}
          >
            {!node.updating &&
              tree.disableAutoUpdate &&
              // find if any nodes in the tree are marked for update (i.e. usually nodes are marked for update because they react to "others" reactor)
              _.some(
                treeNode => treeNode !== node && treeNode.markedForUpdate,
                F.treeToArray(_.get('children'))(tree.tree)
              ) && (
                <div
                  className="filter-field-icon-refresh"
                  onClick={e => {
                    e.stopPropagation()
                    tree.triggerUpdate()
                  }}
                >
                  <Icon icon="Refresh" />
                </div>
              )}
            <Icon
              icon={node.paused ? 'FilterListExpand' : 'FilterListCollapse'}
            />
          </Flex>
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
