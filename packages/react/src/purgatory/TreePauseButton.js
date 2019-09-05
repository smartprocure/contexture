import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { withTheme } from '../utils/theme'

let setPausedNested = (tree, path, value) =>
  tree[`${value ? '' : 'un'}pauseNested`](path)

let TreePauseButton = ({ children, theme: { AlternateButton, Icon } }) => {
  let trees = _.flow(
    React.Children.toArray,
    _.map('props')
  )(children)
  let allPaused = _.every(({ tree, path }) => tree.isPausedNested(path), trees)
  let flip = () =>
    _.each(({ tree, path }) => setPausedNested(tree, path, !allPaused), trees)
  let title = `${allPaused ? 'Expand' : 'Collapse'} Filters`
  return (
    <AlternateButton title={title} onClick={flip}>
      <Icon icon={allPaused ? 'TreeUnpause' : 'TreePause'} />
    </AlternateButton>
  )
}

export default _.flow(
  observer,
  withTheme
)(TreePauseButton)
