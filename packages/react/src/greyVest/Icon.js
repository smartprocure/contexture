import React from 'react'
import { Dynamic } from '../greyVest'
import TextButton from './TextButton'

let SmallIcon = ({ icon, style, ...props }) => (
  <i className="material-icons" style={{ fontSize: 20, ...style }} {...props}>
    {icon}
  </i>
)

let toIcon = id => props => <SmallIcon icon={id} {...props} />

let iconMap = {
  SortAscending: toIcon('expand_less'),
  SortDescending: toIcon('expand_more'),
  MoveLeft: toIcon('chevron_left'),
  MoveRight: toIcon('chevron_right'),
  RemoveColumn: toIcon('remove'),
  AddColumn: toIcon('add'),
  FilterExpand: toIcon('filter_list'),
  FilterCollapse: toIcon('filter_list'),
  FilterAdd: toIcon('filter_list'),
  TableColumnMenu: () => (
    <TextButton>
      <SmallIcon icon="more_vert" />
    </TextButton>
  ),
  FilterListExpand: toIcon('keyboard_arrow_down'),
  FilterListCollapse: toIcon('keyboard_arrow_up'),
  TreePause: toIcon('unfold_less'),
  TreeUnpause: toIcon('unfold_more'),
  PreviousPage: toIcon('chevron_left'),
  NextPage: toIcon('chevron_right'),
  Previous5Pages: () => <span>...</span>,
  Next5Pages: () => <span>...</span>,
  Refresh: () => (
    <TextButton
      className="animated pulse slow infinite"
      style={{ animationDuration: '500ms' }}
    >
      <SmallIcon icon="refresh" />
    </TextButton>
  ),
  AutoUpdate: toIcon('autorenew'),
  New: toIcon('fiber_new'),
  Expand: toIcon('keyboard_arrow_down'),
}

let Icon = ({ icon, ...props }) => (
  <Dynamic component={iconMap[icon] || toIcon(icon)} {...props} />
)

export default Icon
