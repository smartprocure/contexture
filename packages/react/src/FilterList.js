import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer, inject } from 'mobx-react'
import { Flex, Dynamic, Popover } from './layout'
import { withStateLens } from './utils/mobx-react-utils'
import InjectTreeNode from './utils/injectTreeNode'
import DefaultIcon from './DefaultIcon'
import { bdJoin } from './styles/generic'

export let Label = inject(_.pick('tree'))(
  withStateLens({ popover: false })(
    observer(({ tree, node, Icon, ListItem: Item, popover, ...x }) => (
      <Flex
        className={`filter-field-label ${
          _.get('hasValue', node) ? 'filter-field-has-value' : ''
        }`.trim()}
        style={{
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onClick={() =>
          tree && node && tree.mutate(node.path, { paused: !node.paused })
        }
      >
        <span {...x} />
        {tree && node && (
          <React.Fragment>
            <span
              onClick={e => {
                e.stopPropagation()
                F.flip(popover)()
              }}
            >
              <Icon icon="TableColumnMenu" />
              <Popover
                isOpen={popover}
                style={{
                  userSelect: 'none',
                  marginTop: '0.5rem',
                  width: '5.5rem',
                  transform: 'translateX(-2.25rem)',
                  lineHeight: '1.4rem',
                }}
              >
                {/* If only contexture-client diffed the tree before sending a request... */}
                {(node.hasValue || false) && (
                  <Item onClick={() => tree.clear(node.path)}>
                    Clear Filter
                  </Item>
                )}
                <Item onClick={() => tree.remove(node.path)}>
                  Delete Filter
                </Item>
              </Popover>
            </span>
            {
              // Whitespace separator
              <div style={{ flexGrow: 1 }} />
            }
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
            <div className="filter-field-label-icon">
              <Icon
                icon={node.paused ? 'FilterListExpand' : 'FilterListCollapse'}
              />
            </div>
          </React.Fragment>
        )}
      </Flex>
    ))
  )
)
Label.displayName = 'Label'

export let FieldLabel = InjectTreeNode(
  observer(({ node, node: { field } = {}, fields, Icon, ListItem, label }) => (
    <Label node={node} Icon={Icon} ListItem={ListItem}>
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
      tree,
      node,
      typeComponents: types = {},
      fields,
      mapNodeToProps = _.noop,
      mapNodeToLabel = _.noop,
      Icon = DefaultIcon,
      ListItem = 'div',
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
                tree={tree}
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
                  tree={tree}
                  node={child}
                  fields={fields}
                  Icon={Icon}
                  ListItem={ListItem}
                  label={mapNodeToLabel(child, fields, types)}
                />
                {!child.paused && (
                  <div className="filter-list-item-contents">
                    <Dynamic
                      component={types[child.type] || MissingTypeComponent}
                      tree={tree}
                      node={child}
                      path={_.toArray(child.path)}
                      {...mapNodeToProps(child, fields, types)}
                    />
                  </div>
                )}
              </div>
            ),
          _.getOr([], 'children', node)
        )}
      </div>
    )
  ),
  { allowEmptyNode: true }
)
FilterList.displayName = 'FilterList'
