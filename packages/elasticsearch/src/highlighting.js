let F = require('futil')
let _ = require('lodash/fp')

function regexify(criteria) {
  return new RegExp(criteria)
}
function anyRegexesMatch(regexes, criteria) {
  return _.some(_.invokeMap(_.map(regexify, regexes), 'test', criteria))
}

// Convert the fields array to object map where we only pick the first key from the objects
// Highlight fields can be either strings or objects with a single key which value is the ES highlights object config
// If the highlight field is specific as a string only then it uses the default highlights config
let arrayToHighlightsFieldMap = _.flow(
  _.map(F.when(_.isString, x => ({ [x]: {} }))),
  F.ifElse(_.isEmpty, _.always({}), _.mergeAll)
)

// TODO: Support multiple pathToNesteds...
function highlightResults(highlightFields, hit, pathToNested, include) {
  // TODO: Support Regex and Function basis for all options

  // Handle Results Highlighting
  let additionalFields = []
  let {
    additional,
    additionalExclusions,
    inline,
    inlineAliases,
    nested,
  } = highlightFields
  let inlineKeys = _.keys(arrayToHighlightsFieldMap(inline))

  F.eachIndexed((value, key) => {
    // Populate Additional Fields
    let additionalMatches = anyRegexesMatch(additional, key)
    // Exclude explicit exclusions, inline, and nested highlight fields
    let additionalExclusionMatches =
      anyRegexesMatch(additionalExclusions, key) ||
      anyRegexesMatch(inline, key) ||
      anyRegexesMatch(nested, key)
    // If we have an include array, and if the field is inline but is not in the includes, add it to the additionalFields
    let inlineButNotIncluded =
      include && _.includes(key, _.difference(inlineKeys, include))

    if (
      inlineButNotIncluded ||
      (additionalMatches && !additionalExclusionMatches)
    ) {
      additionalFields.push({
        label: key,
        value: value[0],
      })
    } else if (_.includes(key, nested)) {
      if (_.isArray(value) && !_.includes(pathToNested, key)) {
        additionalFields.push({
          label: key,
          value,
        })
      } else {
        // Handle Nested Item Highlighting Replacement
        if (key === pathToNested)
          // Clarify [{a}, {b}] case and not [a,b] case (ie, does not handle http://stackoverflow.com/questions/25565546/highlight-whole-content-in-elasticsearch-for-multivalue-fields)
          throw new Error('Arrays of scalars not supported')

        let field = key.replace(`${pathToNested}.`, '')
        // For arrays, strip the highlighting wrapping and compare to the array contents to match up
        _.each(function(val) {
          let originalValue = val.replace(/<b>|<\/b>/g, '')
          let childItem = _.find(
            item => item[field] === originalValue,
            _.get(pathToNested, hit._source)
          )
          if (childItem) childItem[field] = val
        }, value)
      }
    }
  }, hit.highlight)
  let mainHighlighted = false
  // Copy over all inline highlighted fields
  if (hit.highlight) {
    // do the field replacement for the inline fields
    _.each(val => {
      if (val.endsWith('.*')) {
        // get the root key e.g. "documents" from "documents.*"
        let root = val.split('.*')[0]
        // get all the highlights that start with the root key
        let matchedKeys = _.filter(
          key => _.startsWith(`${root}.`, key),
          _.keys(hit.highlight)
        )
        _.each(
          key => F.setOn(key, hit.highlight[key], hit._source),
          matchedKeys
        )
      } else {
        let highlights = hit.highlight[val]
        if (highlights) {
          F.setOn(
            val,
            highlights.length > 1 ? highlights : highlights[0],
            hit._source
          )
          mainHighlighted = true
        }
      }
    }, inlineKeys)
    // do the field replacement for the inlineAliases fields
    if (inlineAliases) {
      for (let field in inlineAliases) {
        let mapToField = inlineAliases[field]
        // if we have a highlight result matching the inlineAliases TO field
        if (hit.highlight[mapToField]) {
          // if the field is only in inlineAliases OR it is in both but not inlined/highlighted already by the inline section
          if (
            !_.includes(field, inlineKeys) ||
            (_.includes(field, inlineKeys) && !hit.highlight[field])
          ) {
            F.setOn(field, hit.highlight[mapToField][0], hit._source)
            mainHighlighted = true
          }
        }
      }
    }
  }

  return {
    additionalFields,
    mainHighlighted,
  }
}

module.exports = {
  highlightResults,
  arrayToHighlightsFieldMap,
}
