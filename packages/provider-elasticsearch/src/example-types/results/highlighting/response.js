import _ from 'lodash/fp.js'
import F from 'futil'
import { groupByIndexed, setOrReturn } from '../../../utils/futil.js'
import { getArrayFieldsPaths, mergeHighlights } from './util.js'

const stripTags = _.curry((pre, post, str) =>
  str.replaceAll(pre, '').replaceAll(post, '')
)

const getParentArrayPath = (schema, field) =>
  _.find((k) => field.startsWith(k), getArrayFieldsPaths(schema))

const lastWordRegex = /\.(\w+)$/

const getMultiFieldName = (schema, field) => {
  const [multi, sub] = field.split(lastWordRegex)
  return schema.fields[multi]?.elasticsearch?.fields?.[sub] ? multi : field
}

export const transformHighlightResponse = (schema, config, hit) => {
  // Group `city` and `city.exact` under `city`
  const grouped = _.flow(
    groupByIndexed((v, k) => getMultiFieldName(schema, k)),
    _.mapValues(_.flatten)
  )(hit.highlight)

  const getOrderedArrayFragments = (fragments, field) => {
    const arrayPath = getParentArrayPath(schema, field)
    const fragmentPath = field.slice(arrayPath.length + 1) // +1 strips off leading dot
    const sourceArray = _.get(arrayPath, hit._source)

    if (_.isEmpty(sourceArray)) {
      return _.map(
        (fragment) => setOrReturn(fragmentPath, fragment, {}),
        fragments
      )
    }

    // Map of `array item -> highlighted fragment` to speed up ordering the
    // highlighted fragments.
    const fragmentsMap = F.arrayToObject(
      stripTags(config.pre_tag, config.post_tag),
      _.identity,
      fragments
    )

    return _.map((item) => {
      const plain = F.getOrReturn(fragmentPath, item)
      const fragment = fragmentsMap[plain]
      return fragment && setOrReturn(fragmentPath, fragment, {})
    }, sourceArray)
  }

  return F.reduceIndexed(
    (acc, fragments, field) => {
      const path = getParentArrayPath(schema, field)
      return path
        ? _.set(path, getOrderedArrayFragments(fragments, field), acc)
        : schema.fields[field]?.elasticsearch?.meta?.subType === 'blob'
        ? _.set(field, fragments, acc)
        : _.set(field, mergeHighlights(config, ...fragments), acc)
    },
    {},
    grouped
  )
}
