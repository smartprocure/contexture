import React from 'react'
import * as F from 'futil'
import { observer } from 'mobx-react'

import styles from '../styles'
import { Popover } from '../greyVest'
import OperatorMenu from './OperatorMenu'
import { OperatorMoveTarget } from './DragDrop/MoveTargets'

let BlankOperator = ({ open, node, child }) => (
  <div>
    <div
      onClick={F.flip(open)}
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

let JoinOperator = ({ open, hover, node, child }) => (
  <div>
    <div
      onClick={F.flip(open)}
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

let Operator = ({ hover, node, child, parent, tree, index }) => {
  let open = React.useState(false)
  return (
    <div>
      {!(index !== 0 || node.join === 'not') ? (
        <BlankOperator {...{ open, node, child }} />
      ) : (
        <JoinOperator {...{ open, node, child, hover }} />
      )}
      <OperatorMoveTarget {...{ node, tree, index }} />
      <Popover
        open={open}
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
}

export default observer(Operator)
