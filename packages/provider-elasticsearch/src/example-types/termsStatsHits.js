let _ = require('lodash/fp')
let F = require('futil-js')
let { buildRegexQueryForWords } = require('../regex')
let { getField } = require('../fields')

let breadthFirstBucketSwitch = 500000
let getAggregationObject = (config, schema) => ({
  terms: {
    field: getField(schema, config.key_field),
    size: config.size || 10,
    order: {
      [`Stats.${config.order || 'sum'}`]: config.sortDir || 'desc',
    },
  },
  aggs: {
    Stats: {
      stats: {
        field: config.value_field,
      },
    },
    Hits: {
      top_hits: {
        size: config.hitSize || 1,
        _source: {
          include: config.include || [],
        },
      },
    },
  },
})

module.exports = {
  validContext: context =>
    context.config.key_field && context.config.value_field,
  result(context, search, schema) {
    let filter
    let isDetails =
      context.config.details_key_field && context.config.details_value_field
    if (context.config.filter) {
      let rawFieldName = getField(schema, context.config.key_field)
      filter = buildRegexQueryForWords(rawFieldName, false)(context.config.filter)
    }
    let request = {
      aggs: {
        termsStatsHitsStats: getAggregationObject(context.config, schema),
      },
    }
    if (isDetails) {
      F.setOn(
        'aggs.termsStatsHitsStats.aggs.Details',
        getAggregationObject({
          key_field: context.config.details_key_field,
          value_field: context.config.details_value_field,
          size: context.config.details_size,
          order: context.config.details_order,
          sortDir: context.config.details_sortDir,
          include: context.config.details_include,
        }, schema),
        request
      )
    }

    // Breadth first if more buckets than a certain size - which is apparently parent size squared times the child size
    let topSize = context.config.size || 10
    if (topSize * topSize * context.config.hitSize > breadthFirstBucketSwitch)
      request.aggs.termsStatsHitsStats.terms.collect_mode = 'breadth_first'
    if (filter) {
      request.aggs = {
        termsStatsHits: {
          filter,
          aggs: request.aggs,
        },
      }
    }
    return search(request).then(results => ({
      terms: _.map(
        bucket =>
          _.extendAll([
            {
              key: bucket.key,
              doc_count: bucket.doc_count,
            },
            bucket.Stats,
            {
              hits: _.map('_source', _.get('hits.hits', bucket.Hits)),
            },
            isDetails
              ? {
                  details: _.map(
                    detailsBucket =>
                      _.extendAll([
                        {
                          key: detailsBucket.key,
                          doc_count: detailsBucket.doc_count,
                        },
                        detailsBucket.Stats,
                        _.get('hits.hits.0._source', detailsBucket.Hits),
                      ]),
                    bucket.Details.buckets
                  ),
                }
              : {},
          ]),
        (results.aggregations.termsStatsHits || results.aggregations)
          .termsStatsHitsStats.buckets
      ),
    }))
  },
}
