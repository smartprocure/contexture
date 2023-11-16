import _ from 'lodash/fp.js'
import F from 'futil'
import { getArrayFieldsPaths } from './util.js'

export const mergeHighlightsOnSource = (schema, config, source, highlights) => {
  // Account for an edge case where source arrays should only contain
  // highlighted items but there are no highlights in the results.
  if (config?.filterSourceArrays) {
    for (const path of getArrayFieldsPaths(schema)) {
      if (!_.has(path, highlights)) {
        F.setOn(path, [], highlights)
      }
    }
  }

  // Mutate source only for performance reasons
  _.convert({ immutable: false }).mergeWith(
    (src, hi) => {
      if (_.isArray(src) && config?.filterSourceArrays) {
        return F.reduceIndexed(
          (acc, v, i) =>
            _.isUndefined(v)
              ? acc
              : F.push(_.isPlainObject(v) ? _.merge(src[i], v) : v, acc),
          [],
          hi
        )
      }
    },
    source,
    highlights
  )
}
