// TODO: modernize and move to fp

let _ = require('lodash')

function regexify(criteria) {
  return new RegExp(criteria)
}
function anyRegexesMatch(regexes, criteria) {
  return _.some(_.invokeMap(_.map(regexes, regexify), 'test', criteria))
}

// Convert the fields array to object map where we only pick the first key from the objects
// Highlight fields can be either strings or objects with a single key which value is the ES highlights object config
// If the highlight field is specific as a string only then it uses the default highlights config
function arrayToHighlightsFieldMap(array) {
  return _.reduce(array, (a, c) => {
    if (_.isPlainObject(c)) {
      let key = _.findKey(c, _.identity) // get the first key
      a[key] = c[key]
    } else {
      a[c] = {}
    }
    return a
  }, {})
}

// TODO: Support multiple pathToNesteds...
function highlightResults(highlightFields, hit, pathToNested, include) {
  // TODO: Support Regex and Function basis for all options

  // Handle Results Highlighting
  let additionalFields = []
  let { additional, additionalExclusions, inline, inlineAliases, nested, } = highlightFields
  let inlineKeys = _.keys(arrayToHighlightsFieldMap(inline))

  _.each(hit.highlight, (value, key) => {
    // Populate Additional Fields
    let additionalMatches = anyRegexesMatch(additional, key)
    // Exclude explicit exclusions, inline, and nested highlight fields
    let additionalExclusionMatches =
      anyRegexesMatch(additionalExclusions, key) ||
      anyRegexesMatch(inline, key) ||
      anyRegexesMatch(nested, key)
    // If we have an include array, and if the field is inline but is not in the includes, add it to the additionalFields
    let inlineButNotIncluded =
      include && _.includes(_.difference(inlineKeys, include), key)

    if (
      inlineButNotIncluded ||
      (additionalMatches && !additionalExclusionMatches)
    ) {
      additionalFields.push({
        label: key,
        value: value[0],
      })
    } else if (_.includes(nested, key)) {
      if (_.isArray(value) && !_.includes(key, pathToNested)) {
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
        _.each(value, function(val) {
          let originalValue = val.replace(/<b>|<\/b>/g, '')
          let childItem = _.find(
            _.get(hit._source, pathToNested),
            item => item[field] === originalValue
          )
          if (childItem) childItem[field] = val
        })
      }
    }
  })
  let mainHighlighted = false
  // Copy over all inline highlighted fields
  if (hit.highlight) {
    // do the field replacement for the inline fields
    _.each(inlineKeys, val => {
      if (val.endsWith('.*')) {
        // get the root key e.g. "documents" from "documents.*"
        let root = val.split('.*')[0]
        // get all the highlights that start with the root key
        let matchedKeys = _.filter(_.keys(hit.highlight), key => _.startsWith(key, `${root}.`))
        _.each(matchedKeys, key => _.set(hit._source, key, hit.highlight[key]))
      } else {
        let highlights = hit.highlight[val]
        if (highlights) {
          _.set(hit._source, val, highlights.length > 1 ? highlights : highlights[0])
          mainHighlighted = true
        }
      }
    })
    // do the field replacement for the inlineAliases fields
    if (inlineAliases) {
      for (let field in inlineAliases) {
        let mapToField = inlineAliases[field]
        // if we have a highlight result matching the inlineAliases TO field
        if (hit.highlight[mapToField]) {
          // if the field is only in inlineAliases OR it is in both but not inlined/highlighted already by the inline section
          if (
            !_.includes(inlineKeys, field) ||
            (_.includes(inlineKeys, field) && !hit.highlight[field])
          ) {
            _.set(hit._source, field, hit.highlight[mapToField][0])
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
  arrayToHighlightsFieldMap
}
