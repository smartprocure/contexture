let _ = require('lodash')
let Promise = require('bluebird')

module.exports = {
  result(context, search) {
    let page = (context.config.page || 1) - 1
    let pageSize = context.config.pageSize || 10
    let startRecord = page * pageSize
    let sortField = context.config.sortField || '_score'
    let sortDir = context.config.sortDir || 'desc'
    let sort = {
      [sortField]: sortDir === 'asc' ? 1 : -1,
    }

    return Promise.all([
      search([
        {
          $sort: sort,
        },
        {
          $skip: startRecord,
        },
        {
          $limit: pageSize,
        },
      ]),
      search([
        {
          $group: {
            _id: null,
            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]).spread((results, count) => ({
      // TODO - handle aggregate wrapped stuff, e.g. result.result or result.result[0] etc
      response: {
        totalRecords: _.get(count, '0.count'),
        startRecord: startRecord + 1,
        endRecord: startRecord + results.length,
        results,
      },
    }))
  },
}
