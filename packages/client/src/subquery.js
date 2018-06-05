import _ from 'lodash/fp'
import { getTypePropOrError } from './types'

// This is factored out to make it easy to eventually support custom mapSubqueryValues functions
let mapSubqueryValuesByType = (sourceNode, targetNode, types) =>
  _.flow(
    // Looks up the function for sourceNode's type to return a list of values (typically an array) from results
    getTypePropOrError(types, 'subquery.getValues', sourceNode),
    // Looks up the function for targetNode's type to return a changeset that can be passed to `mutate` from a list of a values list (the output of a subquery.getValues call)
    values => getTypePropOrError(types, 'subquery.useValues', targetNode)(values, targetNode)
  )(sourceNode)

// A subquery (in contexture-client) is about taking the output of one search and makng it the input for another search.
// This is an in memory, cross-database, "select in" join on sources that don't need to be relational.
export default _.curry((types, targetTree, targetPath, sourceTree, sourcePath, mapSubqueryValues = mapSubqueryValuesByType) => {
  let targetNode = targetTree.getNode(targetPath)
  let sourceNode = sourceTree.getNode(sourcePath)

  // Dispatch on targetNode when sourceNode is markedForUpdate to trigger loading indicator immediately on targetNode when sourceNode updates
  sourceNode.onMarkForUpdate = () => {
    // No need to await this, because we'll await the mutate action later
    // We rely on the onMarkForUpdate on targetNode to block this dispatch from completing until
    // sourceNode finishes, and since there is a debounce, it should not result in 2 searches.
    // If the node fails validation after mutate, that would block this from running anyway because this shouldn't trigger an actual search.
    targetTree.dispatch({ type: 'all', path: targetPath })
  }

  // Set validation dependency to block search, but uses onMarkForUpdate instead
  // so the targetNode can be marked for update before sourceNode resolves.
  // Validate blocks markedForUpdate but onMarkForUpdate does not.
  targetNode.onMarkForUpdate = () => sourceNode.updatingPromise
  // This version would not mark targetNode for update until sourceNode is done:
  // targetNode.validate = () => sourceNode.updatingPromise.then(() => true)

  // Could also use onResult, but this is more direct and avoids having to cache
  // the promise for this mutate action somewhere
  sourceNode.afterSearch = () =>
    _.flow(
      mapSubqueryValues,
      targetTree.mutate(targetPath)
    )(sourceNode, targetNode, types)
})
