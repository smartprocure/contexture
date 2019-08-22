import React from 'react'
import Dynamic from '../layout/Dynamic'
import IconButton from './IconButton'

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
    <IconButton>
      <SmallIcon icon="more_vert" />
    </IconButton>
  ),
  FilterListExpand: () => <SmallIcon icon="add" />,
  FilterListCollapse: () => <SmallIcon icon="remove" />,
  PreviousPage: () => <SmallIcon icon="chevron_left" />,
  NextPage: () => <SmallIcon icon="chevron_right" />,
  Previous5Pages: () => <span>...</span>,
  Next5Pages: () => <span>...</span>,
  Refresh: () => (
    <IconButton
      className="animated pulse slow infinite"
      style={{ animationDuration: '500ms' }}
    >
      <SmallIcon icon="refresh" />
    </IconButton>
  ),
}

let Icon = ({ icon, ...props }) => (
  <Dynamic component={iconMap[icon]} {...props} />
)

export default Icon
