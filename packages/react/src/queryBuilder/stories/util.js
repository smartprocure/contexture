import React from 'react'
import F from 'futil'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export let DnDDecorator = (storyFn) => (
  <DndProvider backend={HTML5Backend}>{storyFn()}</DndProvider>
)

export let parent = {
  lens: {
    wrapHover: F.objectLens(),
    removeHover: F.objectLens(),
    joinHover: F.objectLens(),
  },
}
