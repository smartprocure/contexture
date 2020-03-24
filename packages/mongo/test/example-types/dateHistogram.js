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
      console.dir({
        hoursOffset,
        entries: result.entries
      })
      expect(result).eql({
        entries: [
          {
            key: 1580515200000,
            day: 1,
            month: 2,
            year: 2020,
            count: 10,
            max: 4500,
            min: 0,
            avg: 2250,
            sum: 22500,
            cardinality: [{}], // mingo $project with $size is broken -- real mongo returns a number here
          },
          {
            key: 1580601600000,
            day: 2,
            month: 2,
            year: 2020,
            count: 10,
            max: 4600,
            min: 100,
            avg: 2350,
            sum: 23500,
            cardinality: [{}],
          },
          {
            key: 1580688000000,
            day: 3,
            month: 2,
            year: 2020,
            count: 10,
            max: 4700,
            min: 200,
            avg: 2450,
            sum: 24500,
            cardinality: [{}],
          },
          {
            key: 1580774400000,
            day: 4,
            month: 2,
            year: 2020,
            count: 10,
            max: 4800,
            min: 300,
            avg: 2550,
            sum: 25500,
            cardinality: [{}],
          },
          {
            key: 1580860800000,
            day: 5,
            month: 2,
            year: 2020,
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
