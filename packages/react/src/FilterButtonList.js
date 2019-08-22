import F from 'futil-js'
import _ from 'lodash/fp'
import React from 'react'
import { setDisplayName } from 'recompose'
import { Dynamic, Flex } from './layout'
import { withNode, withLoader } from './utils/hoc'
import { withTheme } from './utils/theme'
import styles from './styles'

let FilterButtonItem = _.flow(
  setDisplayName('FilterButtonItem'),
  withLoader,
  withTheme
)(
  ({
    node,
    tree,
    fields,
    mapNodeToProps,
    theme: { Button, CheckButton, MissingTypeComponent, Modal },
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

let FilterButtonList = _.flow(
  setDisplayName('FilterButtonList'),
  withNode
)(
  ({
    node,
    tree,
    fields = {},
    mapNodeToProps = _.noop,
    className = 'filter-button-list',
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
              className,
            }}
          />
        )
      }, _.get('children', node))}
    </GroupBox>
  )
)

export default FilterButtonList
