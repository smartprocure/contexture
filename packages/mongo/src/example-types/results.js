let F = require('futil-js')
let _ = require('lodash/fp')
let Promise = require('bluebird')

module.exports = {
  result(context, search, schema, { getSchema }) {
    let {
      page = 1,
      pageSize = 10,
      sortField = '_score',
      sortDir = 'desc',
      populate,
    } = context
    page -= 1
    let startRecord = page * pageSize
    let sort = {
      [sortField]: sortDir === 'asc' ? 1 : -1,
    }

    return Promise.all([
      search(
        _.reject(_.isEmpty, [
          {
            $sort: sort,
          },
          {
            $skip: startRecord,
          },
          {
            $limit: pageSize,
          },
          ...F.mapIndexed((x, as) => {
            let targetSchema = getSchema(x.schema) //|| toSingular(as), //<-- needs compromise-fp
            if (!targetSchema)
              throw Error(`Couldn't find schema configuration for ${x.schema}`)
            if (!targetSchema.mongo)
              throw Error(
                'Populating a non mongo provider schema on a mongo provider schema is not supported'
              )
            let targetCollection = _.get('mongo.collection', targetSchema)
            if (!targetCollection)
              throw Error(
                `The ${
                  targetCollection
                } schema has a mongo configuration, but doesn't have a 'collection' property`
              )

            return {
              $lookup: {
                as,
                from: targetCollection,
                localField: x.localField, // || '_id',
                foreignField: x.foreignField, // || context.schema, <-- needs schema lookup
              },
            }
          }, populate),
        ])
      ),
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
        results,
      },
    }))
  },
}
