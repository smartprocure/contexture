let F = require('futil-js')
let _ = require('lodash/fp')
let Promise = require('bluebird')

module.exports = {
  result: (context, search) => {
    let {
      config: {
        page = 1,
        pageSize = 10,
        sortField = '_score',
        sortDir = 'desc',
        populate = {},
      } = {},
    } = context
    let startRecord = page * pageSize
    let sort = {
      [sortField]: sortDir === 'asc' ? 1 : -1,
    }
    page -= 1

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
        F.mapValuesIndexed(
          (x, as) => ({
            as,
            collection: x.schema, //|| toSingular(as), //<-- needs compromise-fp
            localField: x.localField || '_id',
            foreignField: x.foreignField || context.schema,
          }),
          populate
        ),
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
        totalRecords: _.get('0.count', count),
        startRecord: startRecord + 1,
        endRecord: startRecord + results.length,
        results: results,
      },
    }))
  },
}
