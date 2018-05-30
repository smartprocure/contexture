import _ from 'lodash/fp'
import * as F from 'futil-js'
import {getTypePropOrError} from './types'

export default _.curry((types, from, fromPath, to, toPath) => {
  let toNode = to.getNode(toPath)
  let fromNode = from.getNode(fromPath)
  
  // Set validation dependency to block search
  toNode.validate = () => fromNode.updatingPromise.then(() => true)

  // Set updating dependency to trigger loading indicator immediately on toNode when fromNode updates
  // TODO - this is isn't supported yet

  // Gets results to use as input from the fromNode
  let getCascadeValues = getTypePropOrError(types, 'getCascadeValues', fromNode)
  // Builds a mutate blob for the toNode based on the values from the previous method
  let useCascadeValues = getTypePropOrError(types, 'useCascadeValues', toNode)

  // Cascade input to output
  let onResult = (path, result) => {
    if (_.isEqual(path, fromPath))
      _.flow(
        deltas => getCascadeValues(deltas, fromNode),
        values => useCascadeValues(values, toNode),
        to.mutate(toPath)
      )(result)
  }
  // Handle multiple onResult functions
  from.onResult = _.over([from.onResult, onResult])
})
