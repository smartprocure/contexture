// TODO: modernize and move to fp

let _ = require('lodash')

function regexify(criteria) {
  return new RegExp(criteria)
}
function anyRegexesMatch(regexes, criteria) {
  return _.some(_.invokeMap(_.map(regexes, regexify), 'test', criteria))
}

// TODO: Support multiple pathToNesteds...
function highlightResults(highlightFields, hit, pathToNested, include) {
  // TODO: Support Regex and Function basis for all options

  // Handle Results Highlighting
  let additionalFields = []
  _.each(hit.highlight, (value, key) => {
    // Populate Additional Fields
    let additionalMatches = anyRegexesMatch(highlightFields.additional, key)
    // Exclude explicit exclusions, inline, and nested highlight fields
    let additionalExclusionMatches =
      anyRegexesMatch(highlightFields.additionalExclusions, key) ||
      anyRegexesMatch(highlightFields.inline, key) ||
      anyRegexesMatch(highlightFields.nested, key)
    // If the field is inline but is not in the includes, add it to the additionalFields
    let inlineButNotIncluded = _.includes(_.difference(highlightFields.inline, include), key)
    console.log({ key, inline: highlightFields.inline, include, inlineButNotIncluded, difference: _.difference(highlightFields.inline, include) })
    if (inlineButNotIncluded || (additionalMatches && !additionalExclusionMatches)) {
      additionalFields.push({
        label: key,
        value: value[0],
      })
    } else if (_.includes(highlightFields.nested, key)) {
      // Handle Nested Item Highlighting Replacement

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
    _.each(highlightFields.inline, val => {
      if (hit.highlight[val]) {
        _.set(hit._source, val, hit.highlight[val][0])
        mainHighlighted = true
      }
    })
  }

  return {
    additionalFields,
    mainHighlighted,
  }
}

module.exports = {
  highlightResults,
}
