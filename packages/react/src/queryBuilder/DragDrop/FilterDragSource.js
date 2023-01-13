import dnd from 'react-dnd'

export default dnd.DragSource(
  'filter',
  {
    beginDrag: props => ({
      node: props.child || props.node,
      tree: props.tree,
    }),
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  })
)
