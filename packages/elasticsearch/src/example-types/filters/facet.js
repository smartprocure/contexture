let _ = require('lodash/fp')
let F = require('futil')
let { buildRegexQueryForWords } = require('../../utils/regex')
let { getField } = require('../../utils/fields')
let { negate, elasticsearchIntegerMax } = require('../../utils/elasticDSL')

module.exports = {
  hasValue: _.get('values.length'),
  filter(node, schema) {
    let field = getField(schema, node.field)
    let result = { terms: { [field]: node.values } }
    if (node.mode === 'exclude') result = negate(result)

    // trying to prevent 'Too Many Clauses' exception ... http://george-stathis.com/2013/10/18/setting-the-booleanquery-maxclausecount-in-elasticsearch/
    if (node.values.length > 4095) {
      // 4096 is our actual limit
      result = { bool: { filter: result } }
    }

    return result
  },
  validContext: node => node.field,
  async result(node, search, schema) {
    let { values, size } = node
    let field = getField(schema, node.field)
    let order = {
      term: { _key: 'asc' },
      count: { _count: 'desc' },
    }[node.sort || 'count']

    let resultRequest = {
      aggs: {
        facetOptions: {
          terms: {
            field,
            // Size 0 no longer supported natively by ES: https://github.com/elastic/elasticsearch/issues/18838
            size: size || (size === 0 ? elasticsearchIntegerMax : 10),
            order,
            ...(node.includeZeroes && { min_doc_count: 0 }),
          },
        },
        facetCardinality: { cardinality: { field } },
      },
    }
    if (node.optionsFilter) {
      resultRequest.aggs = {
        topLevelFilter: {
          filter: buildRegexQueryForWords(field)(node.optionsFilter),
          aggs: resultRequest.aggs,
        },
      }
    }

    let agg = F.cascade(
      ['aggregations.topLevelFilter', 'aggregations'],
      await search(resultRequest)
    )
    let result = {
      options: agg.facetOptions.buckets.map(x => ({
        name: x.key,
        count: x.doc_count,
      })),
      cardinality: node.includeZeroes
        ? _.get(
            'aggregations.facetCardinality.value',
            await search({
              aggs: { facetCardinality: { cardinality: { field } } },
              query: { match_all: {} },
            })
          )
        : agg.facetCardinality.value,
    }

    // Get missing counts for values sent up but not included in the results
    let missing = _.difference(values, _.map('name', result.options))

    // If no missing results, move on
    if (!missing.length) return result

    let missingRequest = {
      aggs: {
        facetAggregation: {
          filter: { terms: { [field]: missing } },
          aggs: {
            facetOptions: { terms: { field, size: missing.length, order } },
          },
        },
      },
    }

    let agg2 = (await search(missingRequest)).aggregations.facetAggregation
    let moreOptions = agg2.facetOptions.buckets.map(x => ({
      name: x.key,
      count: x.doc_count,
    }))

    // Add zeroes for options that are still missing (since es wont return 0)
    let stillMissing = _.difference(missing, _.map('name', moreOptions))
    moreOptions = moreOptions.concat(
      stillMissing.map(name => ({ name, count: 0 }))
    )

    result.options = result.options.concat(moreOptions)

    return result
  },
}
