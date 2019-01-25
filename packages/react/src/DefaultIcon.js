import React from 'react'
import { Dynamic } from './'

export let iconMap = {
  SortAscending: () => <span>▲</span>,
  SortDescending: () => <span>▼</span>,
  MoveLeft: () => <span>←</span>,
  MoveRight: () => <span>→</span>,
  RemoveColumn: () => <span>x</span>,
  AddColumn: () => <span>+</span>,
  FilterExpand: () => <span>></span>,
  FilterCollapse: () => <span>V</span>,
  FilterAdd: () => <span>+</span>,
  TableColumnMenu: () => <span>:</span>,
  FilterListExpand: () => <span>◀</span>,
  FilterListCollapse: () => <span>▼</span>,
  NextPage: () => <span>→</span>,
  PreviousPage: () => <span>←</span>,
  Previous5Pages: () => <span>⇜</span>,
  Next5Pages: () => <span>⇝</span>,
  Refresh: ({ onClick }) => <span onClick={onClick}>⟳</span>,
}
let DefaultIcon = ({ icon, onClick }) => (
  <Dynamic component={iconMap[icon]} onClick={onClick} />
)

export default DefaultIcon
