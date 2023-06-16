import { useDrag } from 'react-dnd'

export default (props) =>
  useDrag({
    type: 'filter',
    item: {
      node: props.child || props.node,
      tree: props.tree,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
