let { groupStats } = require('./groupStatUtils')
let { buildResultQuery, filter } = require('../filters/tagsQuery')

module.exports = {
  ...groupStats(buildResultQuery),
  drilldown: filter,
}
