let _ = require('lodash/fp')
// Words from Jeff
let stopRegex = /^(([0-9 ]+)|(received and)|(received and invoiced)|(received no)|(received no invoice)|(fee received)|(fee received and)|(fee received and invoiced)|(and invoiced)|(no invoice)|(invoice no)|(invoices)|(please)|(attention of)|(deliver to attention)|(deliver to attention of)|(to attention)|(to attention of)|(to the)|(for the)|(per attached)|(po to)|(for the)|(purchase order for)|(as per)|invoice|invoiced|receive|received|tax|sales|item|order|purchase|ourselves|out|over|own|same|she|should|so|some|such|than|that|the|their|theirs|them|themselves|then|there|these|they|this|those|through|to|too|under|until|up|very|was|we|were|what|when|where|which|while|who|whom|why|with|would|you|your|yours|yourself|yourselves|a|about|above|after|again|against|all|am|an|and|any|are|as|at|be|because|been|before|being|below|between|both|but|by|cannot|could|did|do|does|doing|down|during|each|few|for|from|further|had|has|have|having|he|her|here|hers|herself|him|himself|his|how|i|if|in|into|is|it|its|itself|me|more|most|my|myself|no|nor|not|of|off|on|once|only|or|other|ought|our|ours|a|about|an|are|as|at|be|by|com|for|from|how|in|is|it|of|on|or|that|the|this|to|was|what|when|where|who|will|with|the|www|a|an|and|are|as|at|be|but|by|for|if|is|no|not|of|on|such|that|the|their|then|there|these|they|this|to|was|will|with|inc|llc|incorporated|corp|corporation|ltd|llp)$/

let junkRegex = /\.|:|\)|\(|=/

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

    // If filtering junk, we'll need more results
    let size = context.config.size || 10
    if (context.config.filterJunk) size *= 2

    let resultRequest = {
      aggs: {
        facetOptions: {
          terms: _.extend(
            {
              field: getField(context),
              size,
              order: {
                term: { _term: 'asc' },
                count: { _count: 'desc' },
              }[context.config.sort || 'count'],
              // include: context.config.filterJunk ? "([A-Za-z0-9]{3,} ?)+" : '*'
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

      // Filter junk
      if (context.config.filterJunk)
        buckets = _.take(
          context.config.size,
          buckets.filter(
            x =>
              x.key.length > 3 &&
              !junkRegex.test(x.key) &&
              !stopRegex.test(x.key)
          )
        )

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
