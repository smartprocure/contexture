import F from 'futil-js'
import _ from 'lodash/fp'
import React from 'react'

import { observer } from 'mobx-react'
import { Dynamic } from '../layout'
import InjectTreeNode from '../utils/injectTreeNode'

export let DefaultMissingTypeComponent = InjectTreeNode(({ node = {} }) => (
  <div>
    Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
  </div>
))

let FieldDescription = observer(({ node }) => (
  <div>
    {node.fieldDescription} {node.typeDescription}
  </div>
))
let WizardItem = ({
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
  let title = label || node.friendlyName || node.key
  return (
    <div>
      <CheckButton checked={node.hasValue} onClick={F.on(modal)}>
        {title}
      </CheckButton>
      <Modal isOpen={modal}>
        <h1>{title}</h1>
        <FieldDescription node={node} />
        <Dynamic
          tree={tree}
          node={node}
          path={_.toArray(node.path)}
          {...mapNodeToProps(node, fields)}
        />
        <Button onClick={() => tree.clear(node.path)}>Clear</Button>
        <Button primary onClick={F.off(modal)}>
          Done
        </Button>
      </Modal>
    </div>
  )
}

let DefaultBox = ({ children, isNested }) => (
  <div
    style={
      isNested
        ? { borderLeft: '3px solid green', padding: '0 10px', margin: '10px 0' }
        : {}
    }
  >
    {children}
  </div>
)

let WizardGroup = ({
  node,
  tree,
  fields,
  mapNodeToProps,
  mapNodeToLabel,
  className,
  Button,
  CheckButton,
  Modal,
  Box = DefaultBox,
  nested = false,
}) => (
  <Box {...{ nested, className }}>
    {_.map(
      child =>
        child.children ? (
          <WizardGroup
            key={child.path}
            nested
            {...{
              tree,
              node: child,
              fields,
              mapNodeToProps,
              mapNodeToLabel,
              className: 'wizard-group',
              Button,
              CheckButton,
              Modal,
            }}
          />
        ) : (
          <div key={child.path}>
            <WizardItem
              key={child.path}
              {...{
                tree,
                node: child,
                fields,
                mapNodeToProps,
                Button,
                CheckButton,
                Modal,
              }}
              label={mapNodeToLabel(child, fields)}
            />
          </div>
        ),
      _.getOr([], 'children', node)
    )}
  </Box>
)

WizardGroup.displayName = 'WizardGroup'
export default WizardGroup
