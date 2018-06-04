import _ from 'lodash/fp'
import * as F from 'futil-js'
import { getTypePropOrError } from './types'

export default _.curry((types, from, fromPath, to, toPath) => {
  let toNode = to.getNode(toPath)
  let fromNode = from.getNode(fromPath)
  
  // Dispatch on toNode when fromNode is markedForUpdate to trigger loading indicator immediately on toNode when fromNode updates
  fromNode.onMarkForUpdate = () => {
    // No need to await this, because we'll await the mutate action later
    // We rely on the onMarkForUpdate on toNode to block this dispatch from completing until
    // fromNode finishes, and since there is a debounce, it should not result in 2 searches.
    // If the node fails validation after mutate, that would block this from running anyway because this shouldn't trigger an actual search.
    to.dispatch({ type: 'all', path: toPath })
  }
  
  // Set validation dependency to block search, but uses onMarkForUpdate instead
  //  so the toNode can be marked for update before fromNode resolves.
  //  Validate blocks markedForUpdate but onMarkForUpdate does not.
  toNode.onMarkForUpdate = () => fromNode.updatingPromise
  // This version would not mark toNode for update until fromNode is done:
  // toNode.validate = () => fromNode.updatingPromise.then(() => true)
  
  // Gets results to use as input from the fromNode
  let getCascadeValues = getTypePropOrError(types, 'getCascadeValues', fromNode)
  // Builds a mutate blob for the toNode based on the values from the previous method
  let useCascadeValues = getTypePropOrError(types, 'useCascadeValues', toNode)
  // cascade -> link search? pipeSearch?
  
  // Could also use onResult, but this is more direct and avoids having to cache
  //  the promise for this mutate action somewhere
  fromNode.afterSearch = () => 
    _.flow(
      deltas => getCascadeValues(deltas, fromNode),
      values => useCascadeValues(values, toNode),
      to.mutate(toPath)
    )(fromNode)
})
