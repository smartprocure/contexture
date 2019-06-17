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

let JoinOperator = ({ state, parentState, node, child }) => (
  <div>
    <div
      onClick={F.flip(state.lens.isOpen)}
      style={{
        ...styles.operator,
        ...styles.bgJoin(parentState.joinHover || node),
      }}
    >
      <span
        style={{
          ...(parentState.joinHover && {
            fontStyle: 'italic',
            opacity: 0.5,
          }),
        }}
      >
        {parentState.joinHover || node.join}
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
  ({ state, parentState, node, child, parent, root, index }) => (
    <div>
      {!(index !== 0 || node.join === 'not') ? (
        <BlankOperator {...{ state, node, child }} />
      ) : (
        <JoinOperator {...{ state, node, child, parentState }} />
      )}
      <OperatorMoveTarget {...{ node, root, index }} />
      <Popover
        isOpen={state.lens.isOpen}
        style={{
          ...styles.operatorPopover,
          ...styles.bdJoin(node),
          ...(parentState.wrapHover && { marginLeft: 0 }),
        }}
      >
        <OperatorMenu {...{ node, parentState, root, parent }} />
      </Popover>
    </div>
  ),
  'Operator'
)

export default Operator
