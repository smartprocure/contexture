import F from 'futil-js'
import _ from 'lodash/fp'
import React from 'react'
import {
  Dynamic,
  Flex,
  CheckButton as DefaultCheckButton,
  Modal as DefaultModal,
  Popover as DefaultPopover,
} from './layout'
import DefaultIcon from './DefaultIcon'
import DefaultMissingTypeComponent from './DefaultMissingTypeComponent'
import { withNode, withLoader } from './utils/injectTreeNode'
import styles from './styles'

let FilterButtonItem = withLoader(
  ({
    node,
    tree,
    fields,
    mapNodeToProps,
    Button,
    CheckButton,
    MissingTypeComponent,
    Modal,
  }) => {
    let mappedProps = mapNodeToProps(node, fields)
    let modal = F.stateLens(React.useState(false))
    let title = // we really need a title, so here's every possible fallback
      _.get('label', mappedProps) ||
      _.get([node.field, 'label'], fields) ||
      node.field ||
      node.key
    let description = _.get('description', mappedProps)
    return (
      <>
        <CheckButton checked={node.hasValue} onClick={F.on(modal)}>
          {title}
        </CheckButton>
        <Modal isOpen={modal}>
          <div className="filter-button-modal">
            <h1>{title}</h1>
            {description && (
              <div className="filter-description">{description}</div>
            )}
            <div className="filter-component">
              <Dynamic
                Component={MissingTypeComponent}
                tree={tree}
                node={node}
                path={_.toArray(node.path)}
                {...mappedProps}
              />
            </div>
            <Button onClick={() => tree.clear(node.path)}>Clear</Button>
            <Button primary onClick={F.off(modal)}>
              Done
            </Button>
          </div>
        </Modal>
      </>
    )
  }
)

let GroupBox = ({ nodeJoinColor, children, nested, className }) => (
  <Flex
    wrap
    className={`${className} ${nested ? 'nested' : ''}`}
    alignItems="center"
    style={{ borderColor: nodeJoinColor }}
  >
    {children}
  </Flex>
)

let FilterButtonList = withNode(
  ({
    node,
    tree,
    fields = {},
    mapNodeToProps = _.noop,
    className = 'filter-button-list',
    Button = 'button',
    CheckButton = DefaultCheckButton,
    Icon = DefaultIcon,
    MissingTypeComponent = DefaultMissingTypeComponent,
    Modal = DefaultModal,
    Popover = DefaultPopover,
    nested = false,
  }) => (
    <GroupBox
      {...{ nested, className }}
      nodeJoinColor={node && styles.joinColor(node)}
    >
      {_.map(child => {
        let Component = child.children ? FilterButtonList : FilterButtonItem
        return (
          <Component
            key={child.path}
            nested
            {...{
              tree,
              node: child,
              fields,
              mapNodeToProps,
              Button,
              CheckButton,
              Icon,
              MissingTypeComponent,
              Modal,
              Popover,
              className,
            }}
          />
        )
      }, _.get('children', node))}
    </GroupBox>
  ),
  { allowEmptyNode: true }
)

FilterButtonList.displayName = 'FilterButtonList'
export default FilterButtonList
