import {DropTarget} from 'react-dnd'
export let FilterDropTarget = spec => DropTarget('filter', spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  dragItem: monitor.getItem()
}))
export default FilterDropTarget