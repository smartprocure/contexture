import F from 'futil'
import _ from 'lodash/fp.js'
import { CartesianProduct } from 'js-combinatorics'
import { mergeHitHighlights } from '../../utils/highlightUtil.js'

export let anyRegexesMatch = (regexes, criteria) =>
  !!_.find((pattern) => new RegExp(pattern).test(criteria), regexes)

export let replaceHighlightTagRegex = (nodeHighlight) => {
  let { pre_tags, post_tags } = nodeHighlight
  return new RegExp(_.join('|', _.concat(pre_tags, post_tags)), 'g')
}

export let containsHighlightTagRegex = (nodeHighlight) => {
  let { pre_tags, post_tags } = nodeHighlight
  let tagRegexes = _.map(
    ([pre, post]) => `${pre}.+?${post}`,
    _.zip(pre_tags, post_tags)
  )
  return new RegExp(_.join('|', tagRegexes))
}

// Convert the fields array to object map where we only pick the first key from the objects
// Highlight fields can be either strings or objects with a single key which value is the ES highlights object config
// If the highlight field is specific as a string only then it uses the default highlights config
export let arrayToHighlightsFieldMap = _.flow(
  _.map(F.when(_.isString, (x) => ({ [x]: {} }))),
  F.ifElse(_.isEmpty, _.always({}), _.mergeAll)
)

// Replace _source value with highlighted result for `fieldName`
let inlineHighlightInSource = (hit, fieldName) => {
  if (fieldName.endsWith('.*')) {
    // Get the root key e.g. "documents" from "documents.*"
    let root = fieldName.split('.*')[0]
    // Get all the highlights that start with the root key
    let matchedKeys = _.filter(
      (key) => _.startsWith(`${root}.`, key),
      _.keys(hit.highlight)
    )
    _.each((key) => F.setOn(key, hit.highlight[key], hit._source), matchedKeys)
  } else {
    let highlights = hit.highlight[fieldName]
    if (highlights) {
      F.setOn(
        fieldName,
        highlights.length > 1 ? highlights : highlights[0],
        hit._source
      )
    }
  }
}

let getAdditionalFields = ({ schemaHighlight, hit, include, inlineKeys }) => {
  let additionalFields = []
  let { additional, additionalExclusions, inline, nested, nestedPath } =
    schemaHighlight

  F.eachIndexed((highlightedValue, fieldName) => {
    // Whether `fieldName` is matched by any field name in `additional`
    let additionalMatches = anyRegexesMatch(additional, fieldName)

    // Exclude explicit exclusions, inline, and nested highlight fields
    let additionalExclusionMatches =
      anyRegexesMatch(additionalExclusions, fieldName) ||
      anyRegexesMatch(inline, fieldName) ||
      anyRegexesMatch(nested, fieldName)

    // Whether there is an include array and `fieldName` is contained in
    // `inline` but is not in `include`
    let inlineButNotIncluded =
      include && _.includes(fieldName, _.difference(inlineKeys, include))

    if (
      inlineButNotIncluded ||
      (additionalMatches && !additionalExclusionMatches)
    ) {
      additionalFields.push({
        label: fieldName,
        value: highlightedValue[0],
      })
    }

    if (
      _.includes(fieldName, nested) &&
      _.isArray(highlightedValue) &&
      !_.includes(nestedPath, fieldName)
    ) {
      additionalFields.push({
        label: fieldName,
        value: highlightedValue,
      })
    }
  }, hit.highlight)

  return additionalFields
}

let handleNested = ({
  schemaHighlight,
  nodeHighlight,
  hit,
  additionalFields,
}) => {
  let { nested, nestedPath, filterNested } = schemaHighlight
  let replaceTagRegex = replaceHighlightTagRegex(nodeHighlight)
  let containsTagRegex = containsHighlightTagRegex(nodeHighlight)

  F.eachIndexed((highlightedValue, fieldName) => {
    if (
      _.includes(fieldName, nested) &&
      !_.find({ label: fieldName }, additionalFields)
    ) {
      // Clarify [{a}, {b}] case and not [a,b] case. See
      // https://github.com/elastic/elasticsearch/issues/7416
      // TODO: We can support arrays of scalars as long as we make sure that
      // `number_of_fragments` is 0 for the highlighted field so that we can
      // compare the array items in full.
      if (fieldName === nestedPath) {
        throw new Error('Arrays of scalars not supported')
      }

      let field = fieldName.replace(`${nestedPath}.`, '')

      // For arrays, strip the highlighting wrapping and compare to the array
      // contents to match up
      for (let val of highlightedValue) {
        let originalValue = val.replace(replaceTagRegex, '')
        let childItem = _.find(
          // TODO: Remove this asap
          (item) => _.trim(_.get(field, item)) === _.trim(originalValue),
          _.get(nestedPath, hit._source)
        )
        if (childItem) F.setOn(field, val, childItem)
      }

      if (filterNested) {
        let filtered = _.filter(
          (arrayField) => containsTagRegex.test(_.get(field, arrayField)),
          _.get(nestedPath, hit._source)
        )
        F.setOn(nestedPath, filtered, hit._source)
      }
    }
  }, hit.highlight)
}

// TODO: Support multiple nestedPaths...
// TODO: Support Regex and Function basis for all options
// TODO: Make this function pure, do not mutate `hit._source`
export let highlightResults = ({
  schemaHighlight, // The schema highlight configuration
  nodeHighlight, // The result node's highlight configuration
  hit, // The ES result
  include, // The columns to return
}) => {
  let { inline, inlineAliases, nestedPath, filterNested } = schemaHighlight
  let inlineKeys = _.keys(arrayToHighlightsFieldMap(inline))

  let additionalFields = getAdditionalFields({
    schemaHighlight,
    hit,
    include,
    inlineKeys,
  })

  // Merge exact subfield matches with field matches, for filters based on
  // copy_to fields to highlight all appropriate fields while respecting
  // other filters that may be applied using exact(non-stemmed) fields
  hit.highlight = mergeHitHighlights(nodeHighlight, inline, hit.highlight)

  // TODO: Make this function pure, do not mutate `hit._source`
  handleNested({
    schemaHighlight,
    nodeHighlight,
    hit,
    additionalFields,
  })

  // TODO: Do not mutate `hit._source`
  if (filterNested && _.isEmpty(hit.highlight)) {
    F.setOn(nestedPath, [], hit._source)
  }

  // Copy over all inline highlighted fields
  if (hit.highlight) {
    for (let field of inlineKeys) {
      // TODO: Make this function pure, do not mutate `hit._source`
      inlineHighlightInSource(hit, field)
    }

    // Do the field replacement for the inlineAliases fields
    for (let [field, mapToField] of _.toPairs(inlineAliases)) {
      // if we have a highlight result matching the inlineAliases TO field
      if (hit.highlight[mapToField]) {
        // if the field is only in inlineAliases OR it is in both but not inlined/highlighted already by the inline section
        if (
          !_.includes(field, inlineKeys) ||
          (_.includes(field, inlineKeys) && !hit.highlight[field])
        ) {
          // TODO: Do not mutate `hit._source`
          F.setOn(field, hit.highlight[mapToField][0], hit._source)
        }
      }
    }
  }

  return { additionalFields }
}

const mergeReplacingArrays = _.mergeWith((target, src) => {
  if (_.isArray(src)) return src
})

export let combineMultiFields = (fields, subFields) =>
  _.flow(
    _.filter('shouldHighlight'),
    _.map('name'),
    (subFields) => new CartesianProduct(_.keys(fields), subFields),
    _.toArray,
    _.map((path) => [_.join('.', path), {}]),
    _.fromPairs,
    _.merge(fields)
  )(subFields)

export let getHighlightSettings = (schema, node) => {
  // Users can opt-out of highlighting by setting `node.highlight` to `false`
  // explicitly.
  // TODO: Reconsider if it makes more sense to opt-in instead of opt-out since
  // highlighting decreases performance.
  let shouldHighlight =
    node.highlight !== false && _.isPlainObject(schema.elasticsearch?.highlight)

  // Highlighting starts with defaults in the schema first
  if (shouldHighlight) {
    // Result nodes can override schema highlighting configuration
    let schemaHighlight = mergeReplacingArrays(
      schema.elasticsearch.highlight,
      node.highlight
    )

    let showOtherMatches = _.getOr(false, 'showOtherMatches', node)
    let schemaInline = _.getOr([], 'inline', schemaHighlight)

    // Get field names from `inlineAliases` that are also in `node.include`
    let schemaInlineAliases = _.flow(
      _.getOr({}, 'inlineAliases'),
      _.entries,
      _.filter(([k]) => _.includes(k, node.include)),
      _.flatten
    )(schemaHighlight)

    // Add field names from `node.highlight.fields` to
    // `schema.elasticsearch.highlight.inline` so we have them as targets for
    // highlight replacement
    schemaHighlight = _.set(
      'inline',
      _.concat(schemaInline, _.keys(node.highlight?.fields)),
      schemaHighlight
    )

    // Convert the highlight fields from array to an object map
    let fields = _.flow(
      _.pick(['inline', 'additionalFields', 'nested']), // Get the highlight fields we will be working with
      _.values,
      _.flatten,
      _.concat(schemaInlineAliases), // Include the provided field aliases if any
      _.uniq,
      arrayToHighlightsFieldMap, // Convert the array to object map so we can simply _.pick again
      (filtered) =>
        showOtherMatches
          ? // Highlight on all fields specified in the initial _.pick above.
            filtered
          : // Only highlight on the fields listed in the node include section and their aliases (if any)
            _.pick(_.concat(node.include, schemaInlineAliases), filtered)
    )(schemaHighlight)

    //Get copy to field mapping
    let copyToFields = _.reduce(
      (groups, fieldConfig) => {
        F.when(
          F.isNotBlank,
          _.each((grp) => {
            //Add base field to copy_to group
            groups[grp] = _.concat([fieldConfig.field], groups[grp] || [])
            //Add sub fields to copy_to group
            _.each((subField) => {
              groups[`${grp}.${subField}`] = _.concat(
                [`${fieldConfig.field}.${subField}`],
                groups[`${grp}.${subField}`] || []
              )
            }, _.map('name', schema.elasticsearch?.subFields))
          }),
          fieldConfig?.elasticsearch?.copy_to
        )
        return groups
      },
      {},
      schema.fields
    )

    fields = combineMultiFields(fields, schema.elasticsearch?.subFields)

    //Map query to copy to fields
    _.each((key) => {
      let isKeyFromCopyTo = false
      let filter = F.transformTree()((node) => {
        if (copyToFields[node?.default_field]?.includes(key)) {
          isKeyFromCopyTo = true
          node.default_field = key
        }
      })(node._meta.relevantFilters)
      if (isKeyFromCopyTo) {
        fields[key] = { highlight_query: filter, ...fields[key] }
        isKeyFromCopyTo = false
      }
    }, _.keys(fields))

    // Properties we support as part of the highlighting configuration that
    // elastic does not have knowledge of.
    let nonElasticProperties = [
      'inline',
      'inlineAliases',
      'additional',
      'additionalExclusions',
      'additionalFields',
      'nested',
      'nestedPath',
      'filterNested',
    ]

    let nodeHighlight = _.merge(
      {
        // The default schema highlighting settings w/o the fields
        pre_tags: ['<b class="search-highlight">'],
        post_tags: ['</b>'],
        require_field_match: true,
        number_of_fragments: 0,
        fields,
      },
      _.omit(nonElasticProperties, node.highlight)
    )

    return { schemaHighlight, nodeHighlight }
  }

  return {}
}
