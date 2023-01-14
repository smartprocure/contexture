import _ from 'lodash/fp.js'
import F from 'futil'
import statistical from './statistical.js'

let { statsAgg } = statistical

export default {
  result: async ({ key_field, value_field }, search) => ({
    terms: _.map(
      F.renameProperty('_id', 'key'),
      await search([statsAgg(value_field, key_field)])
    ),
  }),
}
