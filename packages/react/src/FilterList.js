import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer, inject } from 'mobx-react'
import {
  Flex,
  Dynamic,
  Popover,
  Modal as BaseModal,
  NestedPicker,
} from './layout'
import { fieldsToOptions } from './FilterAdder'
import { withStateLens } from './utils/mobx-react-utils'
import InjectTreeNode from './utils/injectTreeNode'
import DefaultIcon from './DefaultIcon'
import { bdJoin } from './styles/generic'
import { newNodeFromType, changeNodeField } from './utils/search'

export let FilterActions = withStateLens({ modal: false })(
  observer(
    ({ node, tree, fields, Item, Popover, popover, Modal, Picker, modal }) => (
      <>
        <Modal isOpen={modal}>
          <Picker
            options={fieldsToOptions(fields)}
            onChange={field => {
              changeNodeField(tree, node, field)
              F.off(modal)()
            }}
          />
        </Modal>
        <Popover isOpen={popover} className="filter-actions-popover">
          <Item className="filter-actions-selected-type">
            {F.autoLabel(node.type)}
          </Item>
          {_.map(
            x => (
              <Item
                key={x.value}
                onClick={() =>
                  tree.replace(
                    node.path,
                    newNodeFromType(x.value, fields, node)
                  )
                }
              >
                —Change to {x.label}
              </Item>
            ),
            F.autoLabelOptions(
              _.without(
                [node.type],
                _.get([node.field, 'typeOptions'], fields)
              ) || []
            )
          )}
          <div className="filter-actions-separator" />
          <Item onClick={F.on(modal)}>Pick Field</Item>
          {/* If only contexture-client diffed the tree before sending a request... */}
          {(node.hasValue || false) && (
            <Item onClick={() => tree.clear(node.path)}>Clear Filter</Item>
          )}
          <Item onClick={() => tree.remove(node.path)}>Delete Filter</Item>
        </Popover>
      </>
    )
  )
)

export let Label = inject(_.pick('tree'))(
  withStateLens({ popover: false, modal: false })(
    observer(
      ({
        tree,
        node,
        fields,
        Icon,
        ListItem: Item,
        Modal,
        Picker,
        popover,
        modal,
        ...x
      }) => (
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
                <FilterActions
                  node={node}
                  tree={tree}
                  fields={fields}
                  Item={Item}
                  Popover={Popover}
                  popover={popover}
                  Modal={Modal}
                  Picker={Picker}
                  modal={modal}
                />
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
      )
    )
  )
)
Label.displayName = 'Label'

export let FieldLabel = InjectTreeNode(
  observer(
    ({
      tree,
      node,
      node: { field } = {},
      fields,
      Icon,
      ListItem,
      Modal,
      Picker,
      label,
    }) => (
      <Label
        tree={tree}
        node={node}
        Icon={Icon}
        ListItem={ListItem}
        Modal={Modal}
        Picker={Picker}
        fields={fields}
      >
        {label || _.get([field, 'label'], fields) || field}
      </Label>
    )
  )
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
      Modal = BaseModal,
      Picker = NestedPicker,
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
                ListItem={ListItem}
                Modal={Modal}
                Picker={Picker}
              />
            ) : (
              <div key={child.path} className="filter-list-item">
                <FieldLabel
                  tree={tree}
                  node={child}
                  fields={fields}
                  Icon={Icon}
                  ListItem={ListItem}
                  Modal={Modal}
                  Picker={Picker}
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
