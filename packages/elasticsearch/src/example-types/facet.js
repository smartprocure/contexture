let _ = require('lodash/fp')

let rawFieldName = _.pipe(
  _.replace('.untouched', ''),
  _.replace('.shingle', '')
)
let modeMap = {
  word: {
    field: '',
    filter: '',
    optionFilter: '.exact',
  },
  autocomplete: {
    field: '.untouched',
    filter: '.lowercased',
    optionFilter: '.exact',
  },
  suggest: {
    field: '.shingle',
    filter: '.shingle_edgengram',
    optionFilter: '.exact',
  },
}
let getFieldMode = type => context =>
  rawFieldName(context.field) +
  modeMap[context.data.fieldMode || 'autocomplete'][type]
let getField = getFieldMode('field')
let getFilterField = getFieldMode('filter')
let getOptionFilterField = getFieldMode('optionFilter')

module.exports = {
  hasValue: context => _.get('values.length', context.data),
  filter(context) {
    let result = {
      terms: {
        [getField(context)]: context.data.values,
      },
    }

    if (context.data.mode === 'exclude') {
      result = {
        bool: {
          must_not: result,
        },
      }
    }

    // trying to prevent 'Too Many Clauses' exception ... http://george-stathis.com/2013/10/18/setting-the-booleanquery-maxclausecount-in-elasticsearch/
    if (context.data.values.length > 4095) {
      // 4096 is our actual limit
      result = {
        bool: {
          filter: result,
        },
      }
    }

    return result
  },
  result(context, search) {
    let filter
    if (context.config.optionsFilter) {
      let filterParts = context.config.optionsFilter
        .toLowerCase()
        .trim()
        .split(' ')
      filter = {
        bool: {
          must:
            !context.data.fieldMode || context.data.fieldMode === 'autocomplete'
              ? _.map(
                  f => ({
                    wildcard: {
                      [getOptionFilterField(context)]: `${f.replace(
                        /\*|-|\+/g,
                        ''
                      )}*`,
                    },
                  }),
                  filterParts
                )
              : {
                  term: {
                    [getFilterField(context)]: context.config.optionsFilter,
                  },
                },
        },
      }
    }

    let cardinality = _.isNumber(context.config.cardinality)
      ? context.config.cardinality
      : 5000 // setting default precision to reasonable default (40000 is max)

    let resultRequest = {
      aggs: {
        facetOptions: {
          terms: _.extend(
            {
              field: getField(context),
              size: context.config.size || 10,
              order: {
                term: { _term: 'asc' },
                count: { _count: 'desc' },
              }[context.config.sort || 'count'],
            },
            context.data.fieldMode === 'suggest'
              ? {
                  include: `.*${context.config.optionsFilter}.*`,
                }
              : {}
          ),
        },
        facetCardinality: {
          cardinality: {
            field: getField(context),
            precision_threshold: cardinality,
          },
        },
      },
    }
    if (filter)
      resultRequest.aggs = {
        facetAggregation: {
          filter,
          aggs: resultRequest.aggs,
        },
      }

    return search(resultRequest).then(response1 => {
      let agg =
        response1.aggregations.facetAggregation || response1.aggregations
      let buckets = agg.facetOptions.buckets

      let result = {
        total: agg.doc_count,
        cardinality: agg.facetCardinality.value,
        options: buckets.map(x => ({
          name: x.key,
          count: x.doc_count,
        })),
      }

      // If no missing results, move on
      if (
        !(
          context.data &&
          context.data.values &&
          _.difference(context.data.values, _.map('name', result.options))
            .length
        )
      )
        return result

      // Get missing counts for values sent up but not included in the results
      let missing = _.difference(
        context.data.values,
        _.map('name', result.options)
      )
      let missingFilter = {
        terms: {
          [getField(context)]: missing,
        },
      }
      let missingRequest = {
        aggs: {
          facetAggregation: {
            filter: missingFilter,
            aggs: {
              facetOptions: {
                terms: {
                  field: getField(context),
                  size: missing.length,
                  order: {
                    term: { _term: 'asc' },
                    count: { _count: 'desc' },
                  }[context.config.sort || 'count'],
                },
              },
            },
          },
        },
      }
      return search(missingRequest).then(response2 => {
        let agg2 = response2.aggregations.facetAggregation
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
      })
    })
  },
}
