let twoLevelMatch = require('../twoLevelMatch')

module.exports = {
  validContext: twoLevelMatch.validContext,
  result: (node, search) =>
    twoLevelMatch.result({ value_type: 'cardinality', ...node }, search),
}
