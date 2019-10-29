import React from 'react'
import { Dynamic } from '../../greyVest'

let toIcon = symbol => props => <span {...props}>{symbol}</span>

export let iconMap = {
  SortAscending: toIcon('▲'),
  SortDescending: toIcon('▼'),
  MoveLeft: toIcon('←'),
  MoveRight: toIcon('→'),
  RemoveColumn: toIcon('x'),
  AddColumn: toIcon('+'),
  FilterExpand: toIcon('>'),
  FilterCollapse: toIcon('V'),
  FilterAdd: toIcon('+'),
  TableColumnMenu: toIcon(`${String.fromCharCode(160)}:`),
  FilterListExpand: toIcon('◀'),
  FilterListCollapse: toIcon('▼'),
  TreePause: toIcon('⊖'),
  TreeUnpause: toIcon('⊕'),
  NextPage: toIcon('→'),
  PreviousPage: toIcon('←'),
  Previous5Pages: toIcon('⇜'),
  Next5Pages: toIcon('⇝'),
  Refresh: toIcon('⟳'),
  AutoUpdate: ({ style, ...props }) => (
    <span
      style={{ display: 'inline-flex', flexDirection: 'column', ...style }}
      {...props}
    >
      <span style={{ lineHeight: '0.8em' }}>⤺</span>
      <span style={{ lineHeight: '1.2em', marginTop: '-0.5em' }}>⤻</span>
    </span>
  ),
  New: () => (
    <span
      style={{
        fontSize: '0.6em',
        padding: '0.5em 0.2em',
      }}
    >
      NEW
    </span>
  ),
  Expand: toIcon('v'),
}
let DefaultIcon = ({ icon, ...props }) => (
  <Dynamic component={iconMap[icon]} {...props} />
)

export default DefaultIcon
