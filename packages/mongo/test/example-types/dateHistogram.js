let _ = require('lodash/fp')
let { expect } = require('chai')
let mingo = require('mingo')
let dateHistogram = require('../../src/example-types/dateHistogram')

let aggregate = sampleData => aggs => new mingo.Aggregator(aggs).run(sampleData)

// This is super ridiculous to make sure we're working in UTC
// Without this circleci fails - had to ssh in to figure it out
let hoursOffset = new Date().getTimezoneOffset() / 60
let utcDate = x => {
  var d = new Date(x)
  d.setHours(d.getHours() + hoursOffset)
  return d
}

let sampleData = _.times(
  i => ({
    createdAt: utcDate(`2020-02-0${(i % 5) + 1}`),
    metrics: { usersCount: i * 100 },
  }),
  50
)
let simulateAggregation = aggregate(sampleData)

describe('dateHistogram', () => {
  describe('dateHistogram.result', () => {
    it('result should output the expected query and results', async () => {
      let query = null
      let search = _.flow(
        _.tap(x => (query = x)),
        simulateAggregation
      )

      let result = await dateHistogram.result(
        {
          key: 'test',
          type: 'dateHistogram',
          key_field: 'createdAt',
          value_field: 'metrics.usersCount',
          include: ['min', 'max', 'avg', 'sum', 'count', 'cardinality'],
          interval: 'day',
        },
        search
      )
      console.log(JSON.stringify(query, 0, 2))
      expect(query).eql([
        {
          $group: {
            _id: {
              day: { $dayOfMonth: '$createdAt' },
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            avg: { $avg: '$metrics.usersCount' },
            max: { $max: '$metrics.usersCount' },
            min: { $min: '$metrics.usersCount' },
            sum: { $sum: '$metrics.usersCount' },
            count: { $sum: 1 },
            cardinality: { $addToSet: '$createdAt' },
          },
        },
        {
          $project: {
            _id: 0,
            day: '$_id.day',
            month: '$_id.month',
            year: '$_id.year',
            avg: 1,
            max: 1,
            min: 1,
            sum: 1,
            count: 1,
            cardinality: { $size: '$cardinality' },
          },
        },
        { $sort: { year: 1, month: 1, day: 1 } },
      ])
      expect({
        entries: _.map(_.omit(['day', 'month', 'year', 'key']), result.entries),
      }).eql({
        entries: [
          {
            count: 10,
            max: 4500,
            min: 0,
            avg: 2250,
            sum: 22500,
            cardinality: [{}], // mingo $project with $size is broken -- real mongo returns a number here
          },
          {
            count: 10,
            max: 4600,
            min: 100,
            avg: 2350,
            sum: 23500,
            cardinality: [{}],
          },
          {
            count: 10,
            max: 4700,
            min: 200,
            avg: 2450,
            sum: 24500,
            cardinality: [{}],
          },
          {
            count: 10,
            max: 4800,
            min: 300,
            avg: 2550,
            sum: 25500,
            cardinality: [{}],
          },
          {
            count: 10,
            max: 4900,
            min: 400,
            avg: 2650,
            sum: 26500,
            cardinality: [{}],
          },
        ],
      })
    })
  })
})
