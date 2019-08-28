import React from 'react'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
import { useLens } from '../utils/react'
import styles from '../styles'
import Popover from '../greyVest/Popover'
import OperatorMenu from './OperatorMenu'
import { OperatorMoveTarget } from './DragDrop/MoveTargets'

let BlankOperator = ({ isOpen, node, child }) => (
  <div>
    <div
      onClick={F.flip(isOpen)}
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

let OperatorLine = observer(({ node, child, style }) => (
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

let JoinOperator = ({ isOpen, hover, node, child }) => (
  <div>
    <div
      onClick={F.flip(isOpen)}
      style={{
        ...styles.operator,
        ...styles.bgJoin(F.view(hover.join) || node),
      }}
    >
      <span
        style={{
          ...(F.view(hover.join) && {
            fontStyle: 'italic',
            opacity: 0.5,
          }),
        }}
      >
        {F.view(hover.join) || node.join}
      </span>
    </div>
    <OperatorLine {...{ node, child }} />
  </div>
)
JoinOperator.displayName = 'JoinOperator'

let Operator = observer(({ hover, node, child, parent, tree, index }) => {
  let isOpen = useLens(false)
  return (
    <div>
      {!(index !== 0 || node.join === 'not') ? (
        <BlankOperator {...{ isOpen, node, child }} />
      ) : (
        <JoinOperator {...{ isOpen, node, child, hover }} />
      )}
      <OperatorMoveTarget {...{ node, tree, index }} />
      <Popover
        isOpen={isOpen}
        style={{
          ...styles.operatorPopover,
          ...styles.bdJoin(node),
          ...(F.view(hover.wrap) && { marginLeft: 0 }),
        }}
      >
        <OperatorMenu {...{ node, hover, tree, parent }} />
      </Popover>
    </div>
  )
})
Operator.displayName = 'Operator'

export default Operator
