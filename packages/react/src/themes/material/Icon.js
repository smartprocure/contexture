import { Icon } from '@material-ui/core'
import React from 'react'

let iconMap = {
  SortAscending: 'expand_less',
  SortDescending: 'expand_more',
  MoveLeft: 'chevron_left',
  MoveRight: 'chevron_right',
  RemoveColumn: 'remove',
  AddColumn: 'add',
  FilterExpand: 'filter_list',
  FilterCollapse: 'filter_list',
  FilterAdd: 'filter_list',
  TableColumnMenu: 'more_vert',
  FilterListExpand: 'add',
  FilterListCollapse: 'remove',
  PreviousPage: 'chevron_left',
  NextPage: 'chevron_right',
  Previous5Pages: 'more_horiz',
  Next5Pages: 'more_horiz',
  Refresh: 'refresh',
}

export default ({ icon, ...props }) => (
  <Icon fontSize="small" {...props}>
    {iconMap[icon]}
  </Icon>
)
