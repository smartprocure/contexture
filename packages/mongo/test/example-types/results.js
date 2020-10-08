let F = require('futil')
let { expect } = require('chai')
let {
  defaults,
  convertPopulate,
  getResultsQuery,
  getStartRecord,
  getResponse,
  projectFromInclude,
} = require('../../src/example-types/results')

let getSchema = collection => ({ mongo: { collection } })

describe('results', () => {
  describe('convertPopulate', () => {
    it('should translate populate object into an array of $lookup objects', () => {
      let populate = {
        author: {
          schema: 'user',
          localField: 'createdBy',
          foreignField: '_id',
        },
        org: {
          schema: 'organization',
          localField: 'organization',
          foreignField: '_id',
        },
      }
      expect(convertPopulate(getSchema)(populate)).to.deep.equal([
        {
          $lookup: {
            as: 'author',
            from: 'user',
            localField: 'createdBy',
            foreignField: '_id',
          },
        },
        {
          $lookup: {
            as: 'org',
            from: 'organization',
            localField: 'organization',
            foreignField: '_id',
          },
        },
      ])
    })
    it('should add "$unwind" stage if "unwind" is present in the populate config', () => {
      let populate = {
        author: {
          schema: 'user',
          localField: 'createdBy',
          foreignField: '_id',
          unwind: true,
        },
      }
      expect(convertPopulate(getSchema)(populate)).to.deep.equal([
        {
          $lookup: {
            as: 'author',
            from: 'user',
            localField: 'createdBy',
            foreignField: '_id',
          },
        },
        { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
      ])
    })
  })
  describe('getStartRecord', () => {
    it('should return 0 if page is 1', () => {
      let node = { page: 1, pageSize: 10 }
      expect(getStartRecord(node)).to.equal(0)
    })
    it('should return 0 if page is < 1', () => {
      let node = { page: 0, pageSize: 10 }
      expect(getStartRecord(node)).to.equal(0)
    })
    it('should return 10 if page is 2', () => {
      let node = { page: 2, pageSize: 10 }
      expect(getStartRecord(node)).to.equal(10)
    })
  })
  describe('getResultsQuery', () => {
    it('should put $sort, $skip, $limit first in pipeline', () => {
      let node = defaults({
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
      expect(getResultsQuery(node, getSchema, 0)).to.deep.equal([
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
    it('should put $sort, $skip, $limit first in pipeline where sort field is not part of a join', () => {
      let node = defaults({
        key: 'results',
        type: 'results',
        sortField: 'metrics.sessionsCount',
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
      expect(getResultsQuery(node, getSchema, 0)).to.deep.equal([
        { $sort: { 'metrics.sessionsCount': 1 } },
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
    it('should put $sort, $skip, $limit last in pipeline when join field indicated it has many records', () => {
      let node = defaults({
        key: 'results',
        type: 'results',
        sortField: 'metrics.sessionsCount',
        include: ['name', 'user', 'type', 'updatedAt'],
        sortDir: 'asc',
        populate: {
          user: {
            schema: 'user',
            localField: 'user',
            foreignField: '_id',
            unwind: true,
            hasMany: true,
          },
        },
      })
      expect(getResultsQuery(node, getSchema, 0)).to.deep.equal([
        {
          $lookup: {
            as: 'user',
            from: 'user',
            localField: 'user',
            foreignField: '_id',
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: { 'metrics.sessionsCount': 1 } },
        { $skip: 0 },
        { $limit: 10 },
        { $project: { name: 1, user: 1, type: 1, updatedAt: 1 } },
      ])
    })
    it('should put $sort, $skip, $limit first after $lookup', () => {
      let node = defaults({
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
      expect(getResultsQuery(node, getSchema, 0)).to.deep.equal([
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
        { $project: { user: 1, type: 1, updatedAt: 1 } },
      ])
    })
    it('should sort descending and skip $lookup and $project', () => {
      let node = defaults({
        key: 'results',
        type: 'results',
        sortField: 'createdAt',
        sortDir: 'desc',
      })
      expect(getResultsQuery(node, getSchema, 0)).to.deep.equal([
        { $sort: { createdAt: -1 } },
        { $skip: 0 },
        { $limit: 10 },
      ])
    })
    it('should not have $limit stage if pageSize is 0', () => {
      let node = defaults({
        key: 'results',
        type: 'results',
        sortField: 'createdAt',
        pageSize: 0,
      })
      expect(getResultsQuery(node, getSchema, 0)).to.deep.equal([
        { $sort: { createdAt: -1 } },
        { $skip: 0 },
      ])
    })
    it('should not have $sort stage if sortField is missing', () => {
      let node = defaults({ key: 'results', type: 'results' })
      expect(getResultsQuery(node, getSchema, 0)).to.deep.equal([
        { $skip: 0 },
        { $limit: 10 },
      ])
    })
    it('should fetch an extra item if skipCount is true', () => {
      let node = defaults({ key: 'results', type: 'results', pageSize: 10 })
      let query = getResultsQuery(node, getSchema, 0)
      expect(F.findApply('$limit', query)).to.equal(10)
      let skipCountNode = { ...node, skipCount: true }
      let skipCountQuery = getResultsQuery(skipCountNode, getSchema, 0)
      expect(F.findApply('$limit', skipCountQuery)).to.equal(11)
    })
  })
  describe('projectFromInclude', () => {
    it('should remove redundant child paths', () => {
      let include = ['foo', 'foo.bar', 'foo.bar.baz', 'bar.baz.qux', 'bar.baz']
      expect(projectFromInclude(include)).to.deep.equal({
        'bar.baz': 1,
        foo: 1,
      })
    })
  })
  describe('getResponse', () => {
    let node = defaults({ key: 'results', type: 'results', pageSize: 4 })
    let results = [1, 2, 3, 4, 5]
    it('should only set hasMore if count is skipped', async () => {
      expect(getResponse(node, results).hasMore).to.equal(undefined)
    })
    it('should set hasMore if there are extra results', async () => {
      expect(
        getResponse({ ...node, skipCount: true }, results).hasMore
      ).to.equal(true)
    })
    it('should not set hasMore if there are no extra results', async () => {
      expect(
        getResponse({ ...node, skipCount: true }, [1, 2, 3, 4]).hasMore
      ).to.equal(false)
    })
    it('should set startRecord and endRecord based on the page', () => {
      let { startRecord, endRecord } = getResponse(
        { ...node, page: 2 },
        results
      )
      expect(startRecord).to.equal(5)
      expect(endRecord).to.equal(8)
    })
    it('should set totalRecords based on the count (if it exists)', () => {
      expect(getResponse(node, results, 9001).totalRecords).to.equal(9001)
      expect(getResponse(node, results).totalRecords).to.equal(undefined)
    })
  })
})
