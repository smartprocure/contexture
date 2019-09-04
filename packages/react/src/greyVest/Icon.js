import React from 'react'
import { Dynamic } from '../greyVest'
import TextButton from './TextButton'

let SmallIcon = ({ icon }) => (
  <i className="material-icons" style={{ fontSize: 20 }}>
    {icon}
  </i>
)

let iconMap = {
  SortAscending: () => <SmallIcon icon="expand_less" />,
  SortDescending: () => <SmallIcon icon="expand_more" />,
  MoveLeft: () => <SmallIcon icon="chevron_left" />,
  MoveRight: () => <SmallIcon icon="chevron_right" />,
  RemoveColumn: () => <SmallIcon icon="remove" />,
  AddColumn: () => <SmallIcon icon="add" />,
  FilterExpand: () => <SmallIcon icon="filter_list" />,
  FilterCollapse: () => <SmallIcon icon="filter_list" />,
  FilterAdd: () => <SmallIcon icon="filter_list" />,
  TableColumnMenu: () => (
    <TextButton>
      <SmallIcon icon="more_vert" />
    </TextButton>
  ),
  FilterListExpand: () => <SmallIcon icon="add" />,
  FilterListCollapse: () => <SmallIcon icon="remove" />,
  TreePause: () => <SmallIcon icon="remove_circle_outline" />,
  TreeUnpause: () => <SmallIcon icon="add_circle_outline" />,
  PreviousPage: () => <SmallIcon icon="chevron_left" />,
  NextPage: () => <SmallIcon icon="chevron_right" />,
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
}

let Icon = ({ icon, ...props }) => (
  <Dynamic component={iconMap[icon]} {...props} />
)

export default Icon
