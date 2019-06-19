let { expect } = require('chai')
let {
  defaults,
  lookupFromPopulate,
  getResultsQuery,
  getStartRecord,
} = require('../../src/example-types/results')

let getSchema = collection => ({ mongo: { collection } })

describe('results', () => {
  describe('lookupFromPopulate', () => {
    it('should translate populate object into an array of $lookup objects', () => {
      let populate = {
        user: {
          schema: 'user',
          localField: 'user',
          foreignField: '_id',
        },
        organization: {
          schema: 'organization',
          localField: 'organization',
          foreignField: '_id',
        },
      }
      expect(lookupFromPopulate(getSchema)(populate)).to.deep.equal([
        {
          $lookup: {
            as: 'user',
            from: 'user',
            localField: 'user',
            foreignField: '_id',
          },
        },
        {
          $lookup: {
            as: 'organization',
            from: 'organization',
            localField: 'organization',
            foreignField: '_id',
          },
        },
      ])
    })
  })
  describe('getStartRecord', () => {
    it('should return 0 if page is 1', () => {
      expect(getStartRecord(1, 10)).to.equal(0)
    })
    it('should return 0 if page is < 1', () => {
      expect(getStartRecord(0, 10)).to.equal(0)
    })
    it('should return 10 if page is 2', () => {
      expect(getStartRecord(2, 10)).to.equal(10)
    })
  })
  describe('getResultsQuery', () => {
    it('should put $sort, $skip, $limit first in pipeline', () => {
      let context = defaults({
        key: 'results',
        type: 'results',
        sortField: 'createdAt',
        include: ['name', 'user', 'type', 'updatedAt'],
        sortDir: 'asc',
        populate: {
          user: {
            schema: 'user',
            localField: 'user',
            foreignField: '_id',
          },
        },
      })
      expect(getResultsQuery(context, getSchema, 0)).to.deep.equal([
        { $sort: { createdAt: 1 } },
        { $skip: 0 },
        { $limit: 10 },
        {
          $lookup: {
            as: 'user',
            from: 'user',
            localField: 'user',
            foreignField: '_id',
          },
        },
        { $project: { name: 1, user: 1, type: 1, updatedAt: 1 } },
      ])
    })
    it('should sort descending', () => {
      let context = defaults({
        key: 'results',
        type: 'results',
        sortField: 'createdAt',
        sortDir: 'desc',
      })
      expect(getResultsQuery(context, getSchema, 0)).to.deep.equal([
        { $sort: { createdAt: -1 } },
        { $skip: 0 },
        { $limit: 10 },
      ])
    })
    it('should put $sort, $skip, $limit first after $lookup', () => {
      let context = defaults({
        key: 'results',
        type: 'results',
        sortField: 'user.firstName',
        include: ['user.firstName', 'user', 'type', 'updatedAt'],
        sortDir: 'asc',
        populate: {
          user: {
            schema: 'user',
            localField: 'user',
            foreignField: '_id',
          },
        },
      })
      expect(getResultsQuery(context, getSchema, 0)).to.deep.equal([
        {
          $lookup: {
            as: 'user',
            from: 'user',
            localField: 'user',
            foreignField: '_id',
          },
        },
        { $sort: { 'user.firstName': 1 } },
        { $skip: 0 },
        { $limit: 10 },
        { $project: { 'user.firstName': 1, user: 1, type: 1, updatedAt: 1 } },
      ])
    })
  })
})
