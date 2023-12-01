import _ from 'lodash/fp.js'
import F from 'futil'
import { isArrayField, isArrayOfScalarsField } from './util.js'

// Future developer: once you clever lil beast discover that the following
// function is a dirty and unholy `_.merge` you will want to refactor it so that
// all is good can prevail again. However, before you do that, consider that
// this implementation is about 100x faster than `_.merge`. Query 100 records
// with arrays of thousands of elements each and convince yourself.
export const mergeHighlightsOnSource = (schema, hit) => {
  for (const path in hit.highlight) {
    const fragments = hit.highlight[path]
    const field = schema.fields[path]
    if (isArrayField(field)) {
      const sourceArray = _.get(path, hit._source)
      if (sourceArray) {
        for (const index in fragments) {
          if (isArrayOfScalarsField(field)) {
            sourceArray[index] = fragments[index]
          } else {
            F.mergeOn(sourceArray[index], fragments[index])
          }
        }
      } else {
        F.setOn(path, _.values(fragments), hit._source)
      }
      hit.highlight[path] = _.values(fragments)
    } else {
      F.setOn(path, fragments, hit._source)
    }
  }
}
