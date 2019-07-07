import F from 'futil-js'
import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'
import { Dynamic, Flex, 
  CheckButton as DefaultCheckButton, 
  Modal as DefaultModal, 
  Popover as DefaultPopover
} from './layout'
import DefaultIcon from './DefaultIcon'
import InjectTreeNode from './utils/injectTreeNode'
import styles from './styles'

export let DefaultMissingTypeComponent = InjectTreeNode(({ node = {} }) => (
  <div>
    Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
  </div>
))

let FieldDescription = observer(({ node }) => (
  <div className="filter-description">
    {node.fieldDescription} {node.typeDescription}
  </div>
))

let FilterButtonItem = ({
  node,
  tree,
  fields,
  mapNodeToProps,
  label,
  Button,
  CheckButton,
  Modal,
}) => {
  let modal = F.stateLens(React.useState(false))
  let title =
    label || _.get([node.field, 'label'], fields) || node.field || node.key
  return (
    <>
      <CheckButton checked={node.hasValue} onClick={F.on(modal)}>
        {title}
      </CheckButton>
      <Modal isOpen={modal}>
        <div className="filter-button-modal">
          <h1>{title}</h1>
          <FieldDescription node={node} />
          <div className="filter-component">
            <Dynamic
              tree={tree}
              node={node}
              path={_.toArray(node.path)}
              {...mapNodeToProps(node, fields)}
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

let Box = ({ nodeJoinColor, children, nested, className }) => (
  <Flex
    wrap
    className={`${className} ${nested ? 'nested' : ''}`}
    alignItems="center"
    style={{ borderColor: nodeJoinColor }}
  >
    {children}
  </Flex>
)

let FilterButtonList = observer(
  ({
    node,
    tree,
    fields,
    mapNodeToProps = _.noop,
    mapNodeToLabel = _.noop,
    className = "filter-button-list",
    Button = "button",
    CheckButton = DefaultCheckButton,
    Icon = DefaultIcon,
    Modal = DefaultModal,
    Popover = DefaultPopover,
    nested = false,
  }) => (
    <Box {...{ nested, className }} nodeJoinColor={styles.joinColor(node)}>
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
                Button,
                CheckButton,
                Icon,
                Modal,
                Popover,
              }}
              className="filter-button-list"
            />
          ) : (
            <FilterButtonItem
              key={child.path}
              {...{
                tree,
                node: child,
                fields,
                mapNodeToProps,
                Button,
                CheckButton,
                Icon,
                Modal,
                Popover,
              }}
              label={mapNodeToLabel(child, fields)}
            />
          ),
        _.getOr([], 'children', node)
      )}
    </Box>
  )
)

FilterButtonList.displayName = 'FilterButtonList'
export default FilterButtonList
