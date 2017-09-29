let _ = require('lodash'),
  Promise = require('bluebird')

module.exports = {
  result: (context, search, schema) => {
    let page = (context.config.page || 1) - 1,
      pageSize = context.config.pageSize || 10,
      startRecord = page * pageSize,
      sortField = context.config.sortField || '_score',
      sortDir = context.config.sortDir || 'desc',
      sort = {
        [sortField]: sortDir === 'asc' ? 1 : -1
      }

    return Promise.all([
      search([{
        $sort: sort
      }, {
        $skip: startRecord
      }, {
        $limit: pageSize
      }]),
      search([{
        $group: {
          _id: null,
          count: {
            $sum: 1
          }
        }
      }])
    ]).spread((results, count) => ({
      // TODO - handle aggregate wrapped stuff, e.g. result.result or result.result[0] etc
      response: {
        totalRecords: _.get(count, '0.count'),
        startRecord: startRecord + 1,
        endRecord: startRecord + results.length,
        results: results
      }
    }))
  }
}
