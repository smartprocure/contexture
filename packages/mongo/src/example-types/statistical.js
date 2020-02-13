let _ = require('lodash/fp')

let statsAgg = (valueField, keyField) => ({
  $group: {
    _id: keyField ? `$${keyField}` : {},
    count: { $sum: 1 },
    max: { $max: `$${valueField}` },
    min: { $min: `$${valueField}` },
    avg: { $avg: `$${valueField}` },
    sum: { $sum: `$${valueField}` },
  },
})

let defaults = { count: 0, avg: 0, max: 0, min: 0, sum: 0 }

module.exports = {
  statsAgg,
  result: async ({ field }, search) =>
    _.head(await search([statsAgg(field)])) || defaults,
}
