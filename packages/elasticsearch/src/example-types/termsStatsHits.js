let _ = require('lodash/fp')
let F = require('futil')
let { buildRegexQueryForWords } = require('../regex')
let { getField } = require('../fields')

let breadthFirstBucketSwitch = 500000
let getAggregationObject = (node, schema) => ({
  terms: {
    field: getField(schema, node.key_field),
    size: node.size || 10,
    order: {
      [`Stats.${node.order || 'sum'}`]: node.sortDir || 'desc',
    },
  },
  aggs: {
    Stats: {
      stats: {
        field: node.value_field,
      },
    },
    Hits: {
      top_hits: {
        size: node.hitSize || 1,
        _source: {
          include: node.include || [],
        },
      },
    },
  },
})

module.exports = {
  validContext: node => node.key_field && node.value_field,
  result(node, search, schema) {
    let filter
    let isDetails = node.details_key_field && node.details_value_field
    if (node.filter) {
      let rawFieldName = getField(schema, node.key_field)
      filter = buildRegexQueryForWords(rawFieldName, false)(node.filter)
    }
    let request = {
      aggs: {
        termsStatsHitsStats: getAggregationObject(node, schema),
      },
    }
    if (isDetails) {
      F.setOn(
        'aggs.termsStatsHitsStats.aggs.Details',
        getAggregationObject(
          {
            key_field: node.details_key_field,
            value_field: node.details_value_field,
            size: node.details_size,
            order: node.details_order,
            sortDir: node.details_sortDir,
            include: node.details_include,
          },
          schema
        ),
        request
      )
    }

    // Breadth first if more buckets than a certain size - which is apparently parent size squared times the child size
    let topSize = node.size || 10
    if (topSize * topSize * node.hitSize > breadthFirstBucketSwitch)
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
        bucket => ({
          key: bucket.key,
          doc_count: bucket.doc_count,
          ...bucket.Stats,
          hits: _.map('_source', _.get('hits.hits', bucket.Hits)),
          ...(isDetails && {
            details: _.map(
              detailsBucket => ({
                key: detailsBucket.key,
                doc_count: detailsBucket.doc_count,
                ...detailsBucket.Stats,
                ..._.get('hits.hits.0._source', detailsBucket.Hits),
              }),
              bucket.Details.buckets
            ),
          }),
        }),
        (results.aggregations.termsStatsHits || results.aggregations)
          .termsStatsHitsStats.buckets
      ),
    }))
  },
}
