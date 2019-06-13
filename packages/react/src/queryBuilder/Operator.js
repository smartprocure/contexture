import React from 'react'
import * as F from 'futil-js'
import { Component, lenservable } from '../utils/mobx-react-utils'
import styles from '../styles'
import Popover from '../layout/Popover'
import OperatorMenu from './OperatorMenu'
import { OperatorMoveTarget } from './DragDrop/MoveTargets'

let BlankOperator = ({ state, node, child }) => (
  <div>
    <div
      onClick={F.flip(state.lens.isOpen)}
      style={{
        ...styles.blankOperator,
        borderBottomColor: styles.joinColor(node.join),
      }}
    />
    {child.children && child.join !== 'not' && (
      <div
        style={{
          ...styles.operatorLine,
          ...styles.blankOperatorLineExtended,
          ...styles.bgJoin(node),
        }}
      />
    )}
  </div>
)
BlankOperator.displayName = 'BlankOperator'

let OperatorLine = Component(({ node, child, style }) => (
  <div
    style={{
      ...styles.operatorLine,
      ...(child.children &&
        child.join !== 'not' &&
        styles.operatorLineExtended),
      ...styles.bgJoin(node),
      ...style,
    }}
  />
))
OperatorLine.displayName = 'OperatorLine'

let JoinOperator = ({ state, node, child, parent }) => (
  <div>
    <div
      onClick={F.flip(state.lens.isOpen)}
      style={{ ...styles.operator, ...styles.bgJoin(parent.joinHover || node) }}
    >
      <span
        style={{
          ...(parent.joinHover && {
            fontStyle: 'italic',
            opacity: 0.5,
          }),
        }}
      >
        {parent.joinHover || node.join}
      </span>
    </div>
    <OperatorLine {...{ node, child }} />
  </div>
)
JoinOperator.displayName = 'JoinOperator'

let Operator = Component(
  () => ({
    state: lenservable({
      isOpen: false,
    }),
  }),
  ({ state, node, child, parent, root, parentTree, index }) => (
    <div>
      {!(index !== 0 || node.join === 'not') ? (
        <BlankOperator {...{ state, node, child }} />
      ) : (
        <JoinOperator {...{ state, node, child, parent }} />
      )}
      <OperatorMoveTarget {...{ node, root, index }} />
      <Popover
        isOpen={state.lens.isOpen}
        style={{
          ...styles.operatorPopover,
          ...styles.bdJoin(node),
          ...(parent.wrapHover && { marginLeft: 0 }),
        }}
      >
        <OperatorMenu {...{ node, parent, root, parentTree }} />
      </Popover>
    </div>
  ),
  'Operator'
)

export default Operator
