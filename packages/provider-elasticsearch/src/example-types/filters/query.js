import _ from 'lodash/fp.js'
import { luceneQueryProcessor } from '../../utils/luceneQueryUtils.js'
import { stripLegacySubFields } from '../../utils/fields.js'

export default {
  hasValue: _.get('query.length'),
  filter: ({ query, field, exact }) => ({
    query_string: {
      query: luceneQueryProcessor(query),
      default_operator: 'AND',
      default_field: stripLegacySubFields(field) + (exact ? '.exact' : ''),
      ...(exact && { analyzer: 'exact' }),
    },
  }),
}
