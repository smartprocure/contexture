import F from 'futil'
import _ from 'lodash/fp'
import React from 'react'
import { setDisplayName } from 'recompose'
import { Dynamic, Flex } from './greyVest'
import { CheckButton, ModalPicker } from './purgatory'
import { contexturifyWithoutLoader } from './utils/hoc'
import { withTheme } from './utils/theme'
import styles from './styles'
import { newNodeFromField } from './utils/search'
import { fieldsToOptions, unusedOptions } from './FilterAdder'

let FilterButtonItem = _.flow(
  setDisplayName('FilterButtonItem'),
  withTheme
)(
  ({
    node,
    tree,
    fields,
    mapNodeToProps,
    mapNodeToLabel,
    theme: { Button, FilterButton = Button, UnmappedNodeComponent, Modal },
  }) => {
    let mappedProps = mapNodeToProps(node, fields)
    let modal = React.useState(false)
    let title = // we really need a title, so here's every possible fallback
      mapNodeToLabel(node, fields) ||
      _.get('label', mappedProps) ||
      _.get([node.field, 'label'], fields) ||
      node.field ||
      node.key
    let description = _.get('description', mappedProps)
    return (
      <div>
        <CheckButton
          primary={node.hasValue}
          checked={node.hasValue}
          onClick={() => {
            F.on(modal)()
            tree.mutate(node.path, { paused: false })
          }}
          theme={{ Button: FilterButton }}
        >
          {title}
        </CheckButton>
        <Modal open={modal}>
          <Flex column className="filter-button-modal">
            <h1>{title}</h1>
            {description && (
              <div className="filter-description">{description}</div>
            )}
            <div className="filter-component">
              <Dynamic
                {...{
                  component: UnmappedNodeComponent,
                  tree,
                  node,
                  path: _.toArray(node.path),
                  ...mappedProps,
                }}
              />
            </div>
            <Flex style={{ justifyContent: 'flex-end' }}>
              <Button onClick={() => tree.clear(node.path)}>
                Clear Filter
              </Button>
              <Button
                primary
                onClick={() => {
                  F.off(modal)()
                  tree.mutate(node.path, { paused: true })
                }}
                style={{ marginLeft: '10px' }}
              >
                Done
              </Button>
            </Flex>
          </Flex>
        </Modal>
      </div>
    )
  }
)

let GroupBox = ({ nodeJoinColor, children, nested, className, style }) => (
  <Flex
    wrap
    className={`${className} ${nested ? 'nested' : ''}`}
    alignItems="center"
    style={{ borderColor: nodeJoinColor, ...style }}
  >
    {children}
  </Flex>
)

let FilterButtonList = contexturifyWithoutLoader(
  ({
    node,
    tree,
    fields = {},
    mapNodeToProps = _.noop,
    mapNodeToLabel = _.noop,
    allowDuplicateFields = false,
    className = '',
    addFilters = false,
    nested = false,
    style,
    children,
    theme: { Icon, Button, FilterButton = Button },
  }) => {
    let options = allowDuplicateFields
      ? fieldsToOptions(fields)
      : unusedOptions(fields)
    return (
      <GroupBox
        className={`filter-button-list ${className}`}
        {...{ nested, style }}
        nodeJoinColor={node && styles.joinColor(node)}
      >
        {children}
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
                mapNodeToLabel,
                className,
              }}
            />
          )
        }, _.get('children', node))}

        {addFilters && !nested && (
          <div>
            <ModalPicker
              options={options}
              className="check-button"
              onChange={field =>
                tree.add(node.path, newNodeFromField({ field, fields }))
              }
              label={
                <Flex alignItems="center" justifyContent="center">
                  <Icon icon="AddColumn" />
                  {addFilters !== true && <>&nbsp;{addFilters}</>}
                </Flex>
              }
              theme={{ Button: FilterButton }}
            />
          </div>
        )}
      </GroupBox>
    )
  }
)

export default FilterButtonList
