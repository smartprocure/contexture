import React from 'react'
import F from 'futil'
import { observer } from 'mobx-react'

import styles from '../styles/index.js'
import { Popover } from '../greyVest/index.js'
import OperatorMenu from './OperatorMenu.js'
import { OperatorMoveTarget } from './DragDrop/MoveTargets.js'

let BlankOperator = ({ open, node, child }) => (
  <div>
    <div
      onClick={F.flip(open)}
      style={{
        width: `${styles.operatorWidth / 2 + styles.ruleGutter}px`,
        height: styles.operatorHeight / 2,
        marginLeft: `${(styles.operatorWidth - styles.lineWidth) / 2}px`,
        background: styles.background,
        borderBottom: `solid ${styles.lineWidth}px black`,
        borderBottomColor: styles.joinColor(node.join),
      }}
    />
    {child.children && child.join !== 'not' && (
      <div
        style={{
          width: `${styles.ruleGutter}px`,
          bottom: `${styles.operatorHeight / 2}px`,
          height: `${styles.lineWidth}px`,
          position: 'relative',
          left: `${styles.operatorWidth}px`,
          width: styles.operatorWidth / 2,
          top: -styles.lineWidth,
          left: styles.operatorWidth + styles.ruleGutter - styles.lineWidth,
          ...styles.bgJoin(node),
        }}
      />
    )}
  </div>
)

let OperatorLine = observer(({ node, child, style }) => (
  <div
    style={{
      width: `${styles.ruleGutter}px`,
      bottom: `${styles.operatorHeight / 2}px`,
      height: `${styles.lineWidth}px`,
      position: 'relative',
      left: `${styles.operatorWidth}px`,
      ...(child.children &&
        child.join !== 'not' && {
          width: `${
            styles.operatorWidth / 2 + styles.ruleGutter - styles.lineWidth / 2
          }px`,
        }),
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
        width: `${styles.operatorWidth}px`,
        marginRight: `${styles.ruleGutter}px`,
        borderRadius: '5px',
        color: 'white',
        lineHeight: `${styles.operatorHeight}px`,
        textAlign: 'center',
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
          border: `solid 1px black`,
          marginLeft: styles.operatorWidth + styles.ruleGutter, // Set to 0 on wrapHover to avoid jumping
          marginTop: `-${styles.operatorHeight + styles.lineWidth}px`,
          ...styles.bdJoin(node),
          ...(F.view(hover.wrap) && { marginLeft: 0 }),
        }}
      >
        <OperatorMenu {...{ node, hover, tree, parent, child }} />
      </Popover>
    </div>
  )
}

export default observer(Operator)
