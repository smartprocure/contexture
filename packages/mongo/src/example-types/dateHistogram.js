let _ = require('lodash/fp')
let F = require('futil')
let { statsAgg } = require('./statistical')

let keysToObject = F.arrayToObject(x => x)

module.exports = {
  async result(
    {
      key_field,
      value_field,
      interval,
      include = ['min', 'max', 'avg', 'sum'],
      timezone,
    },
    search
  ) {
    let stats = _.omit(['_id'], statsAgg(value_field).$group)
    stats.cardinality = { $addToSet: `$${value_field}` }
    let timeAgg = timezone
      ? { date: `$${key_field}`, timezone }
      : `$${key_field}`
    return {
      entries: _.map(
        x => ({
          ...x,
          key:
            new Date(`${x.year}-${x.month || 1}-${x.day || 1}`).getTime() /
            1000,
        }),
        await search([
          {
            $group: {
              _id: {
                ...(interval === 'day' && { day: { $dayOfMonth: timeAgg } }),
                ...(_.includes(interval, ['day', 'month']) && {
                  month: { $month: timeAgg },
                }),
                year: { $year: timeAgg },
              },
              ..._.pick(include, stats),
            },
          },
          // Mongo ignore missing fields during project :)
          {
            $project: {
              day: '$_id.day',
              month: '$_id.month',
              year: '$_id.year',
              _id: 0,
              ...keysToObject(
                x => (x === 'cardinality' ? { $size: '$cardinality' } : 1),
                include
              ),
            },
          },
          { $sort: { year: 1, month: 1, day: 1 } },
        ])
      ),
    }
  },
}
