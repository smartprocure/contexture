let _ = require('lodash/fp')
let unidecode = require('unidecode')
let { toSafeRegex } = require('../../utils/regex')
let { negate } = require('../../utils/elasticDSL')

module.exports = {
  hasValue: node => node.value || _.get('values.length', node),
  filter(node) {
    let fieldName = node.field.replace('.untouched', '')
    let filterParts = node.values || node.value.toLowerCase().split(' ')

    let useQueryString =
      /\b(contains|containsExact)\b/.test(node.operator) ||
      (node.operator === 'containsWord' && filterParts.length > 2)
    if (useQueryString) {
      let result = {
        query_string: {
          query: _.map(x => `"${x}"`, filterParts).join(' '),
          default_field: fieldName,
          default_operator: node.join === 'any' ? 'OR' : 'AND',
          ...(node.operator === 'containsExact' && { analyzer: 'exact' }),
        },
      }
      return node.join === 'none' ? negate(result) : result
    }

    let lookAtUntouched = /startsWith|endsWith|is|isNot|containsWord/.test(
      node.operator
    )
    if (lookAtUntouched) fieldName += '.untouched'

    if (/endsWith|wordEndsWith/.test(node.operator) && filterParts.length > 2)
      throw new Error("You can't have more than 2 ends with filters")

    let join = {
      all: 'must',
      any: 'should',
      none: 'must_not',
    }[node.join || 'all']

    let filter = {
      bool: {
        [join]: _.map(f => {
          let value = f
            .toLowerCase()
            .replace('*', '')
            .replace('+', '')
            .replace('-', '')
          
          // Special case starts with to use prefix queries
          if (/startsWith|wordStartsWith/.test(node.operator))
            return {
              prefix: {
                [fieldName]: {
                  value,
                  case_insensitive: true
                }
              }
            }
          
          let prefix = /startsWith|wordStartsWith|is|isNot/.test(node.operator)
            ? ''
            : '.*'
          let suffix = /endsWith|wordEndsWith|is|isNot/.test(node.operator)
            ? ''
            : '.*'

          let builtCriteria =
            node.operator === 'regexp'
              ? value
              : unidecode(prefix + toSafeRegex(value) + suffix)

          return {
            regexp: {
              [fieldName]: builtCriteria,
            },
          }
        }, filterParts),
      },
    }

    return /doesNotContain|isNot/.test(node.operator) ? negate(filter) : filter
  },
}
