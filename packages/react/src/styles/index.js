import generic from './generic.js'
import * as queryBuilder from './queryBuilder.js'

export default {
  ...generic,
  ...queryBuilder.styles,
  background: queryBuilder.background,
}
