import F from 'futil'
import _ from 'lodash/fp.js'

function regexify(criteria) {
  return new RegExp(criteria)
}

function anyRegexesMatch(regexes, criteria) {
  return _.some(_.invokeMap(_.map(regexify, regexes), 'test', criteria))
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

let getAdditionalFields = (
  schemaHighlight, // The schema highlight configuration
  hit, // The ES result
  pathToNested, // schema.elasticsearch.nestedPath
  include, // The columns to return
  filterNested // Whether to only return the highlighted fields
) => {
  // Handle Results Highlighting
  let additionalFields = []
  let { additional, additionalExclusions, inline, nested } = schemaHighlight
  let inlineKeys = _.keys(arrayToHighlightsFieldMap(inline))

  F.eachIndexed((value, fieldName) => {
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
        value: value[0],
      })
    } else if (_.includes(fieldName, nested)) {
      if (_.isArray(value) && !_.includes(pathToNested, fieldName)) {
        additionalFields.push({
          label: fieldName,
          value,
        })
      } else {
        // Handle Nested Item Highlighting Replacement
        if (fieldName === pathToNested)
          // Clarify [{a}, {b}] case and not [a,b] case (ie, does not handle http://stackoverflow.com/questions/25565546/highlight-whole-content-in-elasticsearch-for-multivalue-fields)
          throw new Error('Arrays of scalars not supported')

        let field = fieldName.replace(`${pathToNested}.`, '')
        // For arrays, strip the highlighting wrapping and compare to the array contents to match up
        _.each(function (val) {
          let originalValue = val.replace(
            /<b class="search-highlight">|<\/b>/g,
            ''
          )
          let childItem = _.find(
            // TODO: Remove this asap
            (item) => _.trim(_.get(field, item)) === _.trim(originalValue),
            _.get(pathToNested, hit._source)
          )
          if (childItem) childItem[field] = val
        }, value)

        if (filterNested) {
          let filtered = _.flow(
            _.get(pathToNested),
            _.filter(
              _.flow(_.get(field), _.includes('<b class="search-highlight">'))
            )
          )(hit._source)

          F.setOn(pathToNested, filtered, hit._source)
        }
      }
    }
  }, hit.highlight)

  if (filterNested && _.isEmpty(hit.highlight)) {
    F.setOn(pathToNested, [], hit._source)
  }

  return additionalFields
}

// TODO: Support multiple pathToNesteds...
// TODO: Support Regex and Function basis for all options
// TODO: Make this function pure, do not mutate `hit._source`
export let highlightResults = (schemaHighlight, hit, ...args) => {
  // TODO: Make this function pure, do not mutate `hit._source`
  let additionalFields = getAdditionalFields(schemaHighlight, hit, ...args)

  let { inline, inlineAliases } = schemaHighlight
  let inlineKeys = _.keys(arrayToHighlightsFieldMap(inline))

  if (hit.highlight) {
    // Copy over all inline highlighted fields
    for (let field of inlineKeys) {
      // TODO: Make this function pure, do not mutate `hit._source`
      inlineHighlightInSource(hit, field)
    }
    // Do the field replacement for the inlineAliases fields
    for (let [to, from] in _.toPairs(inlineAliases)) {
      if (hit.highlight[from]) {
        // `inline` takes priority over `inlineAliases`, so only replace the
        // `_source` value if the field is not in `inline` OR if there's no
        // highlight returned for the `inline` field
        if (!_.includes(to, inlineKeys) || !hit.highlight[to]) {
          // TODO: Do not mutate `hit._source`
          F.setOn(to, hit.highlight[from][0], hit._source)
        }
      }
    }
  }

  return { additionalFields }
}

export let getHighlightSettings = (schema, node) => {
  // Global schema highlight configuration
  let schemaHighlight =
    node.highlight !== false && schema.elasticsearch.highlight

  // Specific search highlight override
  let nodeHighlight = _.isPlainObject(node.highlight) ? node.highlight : {}

  // to be able to override schema highlight config with node config
  if (nodeHighlight.override) {
    schemaHighlight = nodeHighlight.override
    nodeHighlight = _.omit('override', nodeHighlight)
  }

  // Highlighting starts with defaults in the schema first
  if (schemaHighlight) {
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
      _.concat(schemaInline, _.keys(nodeHighlight.fields)),
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

    let searchHighlight = _.merge(
      {
        // The default schema highlighting settings w/o the fields
        pre_tags: ['<b class="search-highlight">'],
        post_tags: ['</b>'],
        require_field_match: false,
        number_of_fragments: 0,
        fields,
      },
      nodeHighlight
    )

    return { schemaHighlight, searchHighlight }
  }

  return {}
}
