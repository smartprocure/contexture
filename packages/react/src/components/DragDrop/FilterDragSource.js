import {DragSource} from 'react-dnd'
export default DragSource('filter', {
  beginDrag: props => ({
    node: props.child || props.node,
    tree: props.tree
  }),
}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
