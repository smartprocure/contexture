let _ = require('lodash/fp')

module.exports = {
  hasValue: context => _.get('values.length', context),
  /**
   * VALID CONTEXT
   * 1. Must have "field" (String) and "ranges" (Array) properties
   * 2. Each range object must have a "key" property
   * 3. Each range must have either "from" or "to" property
   */
  validContext: context =>
    _.has('field', context) &&
    !!_.get('ranges.length', context) &&
    _.every(
      r => _.has('key', r) && (_.has('from', r) || _.has('to', r)),
      context.ranges
    ),
  /**
   * FILTER
   * Based on the keys checked we get the actual datemath values
   * from the context.ranges and compose a bool/should query.
   **/
  filter(context) {
    let { field, ranges, values } = context
    let should = _.flow(
      _.filter(r => _.includes(r.key, values)),
      _.map(({ from, to }) => ({
        range: {
          [field]: {
            ...(from && { from }),
            ...(to && { to }),
          },
        },
      }))
    )(ranges)

    return { bool: { should } }
  },
  /**
   * RESULT
   * Contest should have `ranges` prop where each range has a "key" prop.
   * Example:
      ranges: [
        { from: 'now/d', key: "open" },
        { to: 'now-1d/d', key: "expired" }
      ]
   */
  result(context, search) {
    return search({
      aggs: {
        range: {
          date_range: {
            field: _.getOr('', 'field', context),
            format: _.getOr('MM-yyyy', 'format', context),
            ranges: context.ranges, // ranges must have a key
          },
        },
      },
      size: 0,
    }).then(response =>
      _.flow(
        _.get('aggregations.range.buckets'),
        _.map(({ key, doc_count }) => ({
          name: key,
          count: doc_count,
        }))(response)
      )
    )
  },
}
