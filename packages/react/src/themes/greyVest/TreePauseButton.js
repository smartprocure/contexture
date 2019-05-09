import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import IconButton from './IconButton'

let setPausedNested = (tree, path, value) =>
  tree[`${value ? '' : 'un'}pauseNested`](path)

let TreePauseButton = ({ children }) => {
  let trees = React.Children.map(children, x => x.props)
  let allPaused = _.every(({ tree, path }) => tree.isPausedNested(path), trees)
  let flip = () =>
    _.each(({ tree, path }) => setPausedNested(tree, path, !allPaused), trees)
  let title = `${allPaused ? 'Expand' : 'Collapse'} Filters`
  return (
    <IconButton title={title} onClick={flip}>
      <i className="material-icons">
        {allPaused ? 'add_circle_outline' : 'remove_circle_outline'}
      </i>
    </IconButton>
  )
}

export default observer(TreePauseButton)
