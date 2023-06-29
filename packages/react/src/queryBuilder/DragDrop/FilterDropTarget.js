import { useDrop } from 'react-dnd'

export let useFilterDropTarget = (spec) =>
  useDrop({
    accept: 'filter',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      dragItem: monitor.getItem(),
    }),
    ...spec,
  })
export default useFilterDropTarget
