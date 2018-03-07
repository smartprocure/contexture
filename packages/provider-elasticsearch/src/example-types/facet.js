let _ = require('lodash/fp')
let F = require('futil-js')
let { buildRegexQueryForWords, buildRegexForWords } = require('../regex')
let { getField } = require('../fields')

module.exports = {
  hasValue: context => _.get('values.length', context),
  filter(context, schema = {}) {
    let field = getField(schema, context.field, context.fieldMode)
    let result = {
      terms: {
        [field]: context.values,
      },
    }

    if (context.mode === 'exclude') {
      result = {
        bool: {
          must_not: result,
        },
      }
    }

    // trying to prevent 'Too Many Clauses' exception ... http://george-stathis.com/2013/10/18/setting-the-booleanquery-maxclausecount-in-elasticsearch/
    if (context.values.length > 4095) {
      // 4096 is our actual limit
      result = {
        bool: {
          filter: result,
        },
      }
    }

    return result
  },
  async result(context, search, schema) {
    let field = getField(schema, context.field, context.fieldMode)
    let values = _.get('values', context)

    let resultRequest = {
      aggs: {
        facetOptions: {
          terms: _.extendAll([
            {
              field,
              size: context.size || context.size === 0 ? context.size : 10,
              order: {
                term: { _term: 'asc' },
                count: { _count: 'desc' },
              }[context.sort || 'count'],
            },
            context.includeZeroes && { min_doc_count: 0 },
            context.optionsFilter && {
              include: buildRegexForWords(
                context.caseSensitive,
                context.anyOrder, // Scary
                context.maxWords
              )(context.optionsFilter),
            },
          ]),
        },
        facetCardinality: {
          cardinality: {
            field,
            precision_threshold: _.isNumber(context.cardinality)
              ? context.cardinality
              : 5000, // setting default precision to reasonable default (40000 is max),
          },
        },
      },
    }

    if (context.optionsFilter) {
      resultRequest.aggs = {
        topLevelFilter: {
          filter: buildRegexQueryForWords(field)(context.optionsFilter),
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
      cardinality: context.includeZeroes
        ? _.get(
            'aggregations.facetCardinality.value',
            await search({
              aggs: {
                facetCardinality: {
                  cardinality: {
                    field,
                  },
                },
              },
              query: {
                match_all: {},
              },
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
          filter: {
            terms: {
              [field]: missing,
            },
          },
          aggs: {
            facetOptions: {
              terms: {
                field,
                size: missing.length,
                order: {
                  term: { _term: 'asc' },
                  count: { _count: 'desc' },
                }[context.sort || 'count'],
              },
            },
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
      stillMissing.map(x => ({
        name: x,
        count: 0,
      }))
    )

    result.options = result.options.concat(moreOptions)

    return result
  },
}
