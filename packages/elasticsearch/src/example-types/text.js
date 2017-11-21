let _ = require('lodash/fp')
let unidecode = require('unidecode')

const vRegex = str => str
  .replace(/[.?+*|{}\[\]()]/g, '\\$&')
  .split('')
  .map(ch => ch.match(/[A-Za-z]/) ? `[${ch.toUpperCase()}${ch.toLowerCase()}]` : ch)
  .join('')

module.exports = {
  hasValue: context =>
    context.data.value || _.get('values.length', context.data),
  filter(context) {
    let fieldName = context.field.replace('.untouched', '')
    let filterParts =
      context.data.values || context.data.value.toLowerCase().split(' ')

    let lookAtKeyword = /startsWith|endsWith|is|isNot|containsWord/.test(
      context.data.operator
    )

    let useQueryString =
      /\b(contains|containsExact)\b/.test(context.data.operator) ||
      (context.data.operator === 'containsWord' && filterParts.length > 2)

    if (useQueryString) {
      let result = {
        query_string: {
          query: _.map(x => `"${x}"`, filterParts).join(' '),
          default_field: fieldName,
          default_operator: context.data.join === 'any' ? 'OR' : 'AND',
        },
      }
      if (context.data.operator === 'containsExact')
        result.query_string.analyzer = 'exact'
      if (context.data.join === 'none') {
        result = {
          bool: {
            must_not: result,
          },
        }
      }
      return result
    }

    if (lookAtKeyword) fieldName += '.keyword'

    if (
      /endsWith|wordEndsWith/.test(context.data.operator) &&
      filterParts.length > 2
    )
      throw new Error("You can't have more than 2 ends with filters")

    let join = {
      all: 'must',
      any: 'should',
      none: 'must_not',
    }[context.data.join || 'all']

    let filter = {
      bool: {
        [join]: _.map(f => {
          let criteria = f
            .toLowerCase()
            .replace('*', '')
            .replace('+', '')
            .replace('-', '')
          if (lookAtKeyword)
            criteria = (context.data.value || f).toLowerCase()

          let prefix = /startsWith|wordStartsWith|is|isNot/.test(
            context.data.operator
          )
            ? ''
            : '.*'
          let suffix = /endsWith|wordEndsWith|is|isNot/.test(
            context.data.operator
          )
            ? ''
            : '.*'

          return {
            regexp: {
              [fieldName]: unidecode(prefix + vRegex(criteria) + suffix),
            },
          }
        }, filterParts),
      },
    }

    if (/doesNotContain|isNot/.test(context.data.operator)) {
      filter = {
        bool: {
          must_not: filter,
        },
      }
    }

    return filter
  },
}
