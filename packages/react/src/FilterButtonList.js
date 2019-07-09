import F from 'futil-js'
import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'
import {
  Dynamic,
  Flex,
  CheckButton as DefaultCheckButton,
  Modal as DefaultModal,
  Popover as DefaultPopover,
} from './layout'
import DefaultIcon from './DefaultIcon'
import InjectTreeNode from './utils/injectTreeNode'
import styles from './styles'

export let DefaultMissingTypeComponent = InjectTreeNode(({ node = {} }) => (
  <div>
    Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
  </div>
))

let FilterButtonItem = ({
  node,
  tree,
  fields,
  mapNodeToProps,
  mapNodeToDescription,
  mapNodeToLabel,
  Button,
  CheckButton,
  Modal,
}) => {
  let mappedProps = mapNodeToProps(node, fields)
  let modal = F.stateLens(React.useState(false))
  let title =
    _.get('label', mappedProps) ||
    mapNodeToLabel(node, fields) ||
    node.field ||
    node.key
  let description =
    node.description ||
    _.get('description', mappedProps) ||
    mapNodeToDescription(node, fields)
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

let FilterButtonList = InjectTreeNode(
  observer(
    ({
      node,
      tree,
      fields = {},
      mapNodeToProps = _.noop,
      mapNodeToLabel = _.noop,
      mapNodeToDescription = _.noop,
      className = 'filter-button-list',
      Button = 'button',
      CheckButton = DefaultCheckButton,
      Icon = DefaultIcon,
      Modal = DefaultModal,
      Popover = DefaultPopover,
      nested = false,
    }) => (
      <GroupBox
        {...{ nested, className }}
        nodeJoinColor={node && styles.joinColor(node)}
      >
        {_.map(
          child =>
            child.children ? (
              <FilterButtonList
                key={child.path}
                nested
                {...{
                  tree,
                  node: child,
                  fields,
                  mapNodeToProps,
                  mapNodeToLabel,
                  mapNodeToDescription,
                  Button,
                  CheckButton,
                  Icon,
                  Modal,
                  Popover,
                  className,
                }}
              />
            ) : (
              <FilterButtonItem
                key={child.path}
                {...{
                  tree,
                  node: child,
                  fields,
                  mapNodeToLabel,
                  mapNodeToDescription,
                  mapNodeToProps,
                  Button,
                  CheckButton,
                  Icon,
                  Modal,
                  Popover,
                }}
              />
            ),
          _.get('children', node)
        )}
      </GroupBox>
    )
  ),
  { allowEmptyNode: true }
)

FilterButtonList.displayName = 'FilterButtonList'
export default FilterButtonList
