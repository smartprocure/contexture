import React from 'react'

let iconMap = {
  SortAscending:  () => <span>▲</span>,
  SortDescending:  () => <span>▼</span>,
  MoveLeft:  () => <span>←</span>,
  MoveRight:  () => <span>→</span>,
  RemoveColumn:  () => <span>x</span>,
  AddColumn:  () => <span>+</span>,
  FilterExpand:  () => <span>></span>,
  FilterCollapse:  () => <span>V</span>,
  FilterAdd:  () => <span>+</span>,
  TableColumnMenu:  () => <span>:</span>,
  FilterListExpand:  () => <span>◀</span>,
  FilterListCollapse:  () => <span>▼</span>,
  
}
let DefaultIcon = ({ icon }) => {
  let C = iconMap[icon]
  return C ? <C /> : null
}
export default DefaultIcon