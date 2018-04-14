import generic from './generic'
import * as queryBuilder from './queryBuilder'

export default {
  ...generic,
  ...queryBuilder.styles,
  background: queryBuilder.background,
}
