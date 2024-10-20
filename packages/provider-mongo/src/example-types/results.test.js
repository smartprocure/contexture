import F from 'futil'
import result from './results.js'
import { describe, expect, it } from 'vitest'

let {
  defaults,
  convertPopulate,
  checkPopulate,
  getResultsQuery,
  getStartRecord,
  getResponse,
  projectFromInclude,
} = result

let getSchema = (collection) => ({ mongo: { collection } })

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
      expect(convertPopulate(getSchema)(populate)).toEqual([
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

    it("support converting the 'as'  attribute to the $lookup 'as' prop", () => {
      let populate = {
        author: {
          schema: 'user',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'keyAuthor',
        },
        org: {
          schema: 'organization',
          localField: 'organization',
          foreignField: '_id',
          as: 'keyOrg',
        },
      }
      expect(convertPopulate(getSchema)(populate)).toEqual([
        {
          $lookup: {
            as: 'keyAuthor',
            from: 'user',
            localField: 'createdBy',
            foreignField: '_id',
          },
        },
        {
          $lookup: {
            as: 'keyOrg',
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
      expect(convertPopulate(getSchema)(populate)).toEqual([
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
    it('should default to _id if foreignField is missing', () => {
      let populate = {
        author: {
          schema: 'user',
          localField: 'createdBy',
        },
      }
      expect(convertPopulate(getSchema)(populate)).toEqual([
        {
          $lookup: {
            as: 'author',
            from: 'user',
            localField: 'createdBy',
            foreignField: '_id',
          },
        },
      ])
    })
    it('should do populate includes by omitting from the base record', () => {
      let populate = {
        author: {
          schema: 'user',
          localField: 'createdBy',
          foreignField: '_id',
          include: ['_id', 'firstName', 'lastName'],
        },
      }
      let getTestSchema = () => ({
        mongo: { collection: 'user' },
        fields: {
          _id: {},
          firstName: 'John',
          lastName: 'Smith',
          password: 'doNotLetMeThrough',
        },
      })
      expect(convertPopulate(getTestSchema)(populate)).toEqual([
        {
          $lookup: {
            as: 'author',
            from: 'user',
            localField: 'createdBy',
            foreignField: '_id',
          },
        },
        {
          $project: {
            'author.password': 0,
          },
        },
      ])
    })
    it('should do populate without omitting from the base record when include field is a parent of nested field object in the schema', () => {
      let populate = {
        author: {
          schema: 'user',
          localField: 'createdBy',
          foreignField: '_id',
          include: ['_id', 'preferences'],
        },
      }
      let getTestSchema = () => ({
        mongo: { collection: 'user' },
        fields: {
          _id: {},
          password: 'doNotLetMeThrough',
          'preferences.option1': true,
          'preferences.option2': false,
        },
      })
      expect(convertPopulate(getTestSchema)(populate)).toEqual([
        {
          $lookup: {
            as: 'author',
            from: 'user',
            localField: 'createdBy',
            foreignField: '_id',
          },
        },
        {
          $project: {
            'author.password': 0,
          },
        },
      ])
    })
    it('should do populate without omitting from the base record when include field is nested field from an object in the schema', () => {
      let populate = {
        author: {
          schema: 'user',
          localField: 'createdBy',
          foreignField: '_id',
          include: ['_id', 'preferences.option1'],
        },
      }
      let getTestSchema = () => ({
        mongo: { collection: 'user' },
        fields: {
          _id: {},
          password: 'doNotLetMeThrough',
          preferences: {},
        },
      })
      expect(convertPopulate(getTestSchema)(populate)).toEqual([
        {
          $lookup: {
            as: 'author',
            from: 'user',
            localField: 'createdBy',
            foreignField: '_id',
          },
        },
        {
          $project: {
            'author.password': 0,
          },
        },
      ])
    })
  })
  describe('getStartRecord', () => {
    it('should return 0 if page is 1', () => {
      let node = { page: 1, pageSize: 10 }
      expect(getStartRecord(node)).toBe(0)
    })
    it('should return 0 if page is < 1', () => {
      let node = { page: 0, pageSize: 10 }
      expect(getStartRecord(node)).toBe(0)
    })
    it('should return 10 if page is 2', () => {
      let node = { page: 2, pageSize: 10 }
      expect(getStartRecord(node)).toBe(10)
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
      expect(getResultsQuery(node, getSchema, 0)).toEqual([
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
      expect(getResultsQuery(node, getSchema, 0)).toEqual([
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
    it('should put $skip, $limit last in pipeline when join field indicated it has many records', () => {
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
      expect(getResultsQuery(node, getSchema, 0)).toEqual([
        { $sort: { 'metrics.sessionsCount': 1 } },
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
        { $skip: 0 },
        { $limit: 10 },
        { $project: { name: 1, user: 1, type: 1, updatedAt: 1 } },
      ])
    })

    it('should put $skip, $limit last in pipeline when join field indicated it has many records when use "as" in populate', () => {
      let node = defaults({
        key: 'results',
        type: 'results',
        sortField: 'metrics.sessionsCount',
        include: ['name', 'auther.test', 'type', 'updatedAt'],
        sortDir: 'asc',
        populate: {
          user: {
            schema: 'user',
            as: 'auther.test',
            localField: 'auther.test',
            foreignField: '_id',
            unwind: true,
            hasMany: true,
          },
        },
      })
      expect(getResultsQuery(node, getSchema, 0)).toEqual([
        { $sort: { 'metrics.sessionsCount': 1 } },
        {
          $lookup: {
            as: 'auther.test',
            from: 'user',
            localField: 'auther.test',
            foreignField: '_id',
          },
        },
        {
          $unwind: {
            path: '$auther.test',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $skip: 0 },
        { $limit: 10 },
        { $project: { name: 1, 'auther.test': 1, type: 1, updatedAt: 1 } },
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
      expect(getResultsQuery(node, getSchema, 0)).toEqual([
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
      expect(getResultsQuery(node, getSchema, 0)).toEqual([
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
      expect(getResultsQuery(node, getSchema, 0)).toEqual([
        { $sort: { createdAt: -1 } },
        { $skip: 0 },
      ])
    })
    it('should not have $sort stage if sortField is missing', () => {
      let node = defaults({ key: 'results', type: 'results' })
      expect(getResultsQuery(node, getSchema, 0)).toEqual([
        { $skip: 0 },
        { $limit: 10 },
      ])
    })
    it('should fetch an extra item if skipCount is true', () => {
      let node = defaults({ key: 'results', type: 'results', pageSize: 10 })
      let query = getResultsQuery(node, getSchema, 0)
      expect(F.findApply('$limit', query)).toBe(10)
      let skipCountNode = { ...node, skipCount: true }
      let skipCountQuery = getResultsQuery(skipCountNode, getSchema, 0)
      expect(F.findApply('$limit', skipCountQuery)).toBe(11)
    })
  })
  describe('projectFromInclude', () => {
    it('should remove redundant child paths', () => {
      let include = ['foo', 'foo.bar', 'foo.bar.baz', 'bar.baz.qux', 'bar.baz']
      expect(projectFromInclude(include)).toEqual({
        'bar.baz': 1,
        foo: 1,
      })
    })
  })
  describe('getResponse', () => {
    let node = defaults({ key: 'results', type: 'results', pageSize: 4 })
    let results = [1, 2, 3, 4, 5]
    it('should only set hasMore if count is skipped', async () => {
      expect(getResponse(node, results).hasMore).toBeUndefined()
    })
    it('should set hasMore if there are extra results', async () => {
      expect(getResponse({ ...node, skipCount: true }, results).hasMore).toBe(
        true
      )
    })
    it('should not set hasMore if there are no extra results', async () => {
      expect(
        getResponse({ ...node, skipCount: true }, [1, 2, 3, 4]).hasMore
      ).toBe(false)
    })
    it('should set startRecord and endRecord based on the page', () => {
      let { startRecord, endRecord } = getResponse(
        { ...node, page: 2 },
        results
      )
      expect(startRecord).toBe(5)
      expect(endRecord).toBe(8)
    })
    it('should set totalRecords based on the count (if it exists)', () => {
      expect(getResponse(node, results, 9001).totalRecords).toBe(9001)
      expect(getResponse(node, results).totalRecords).toBeUndefined()
    })
  })
  describe('checkPopulate', () => {
    it('should throw on an unincluded local field', () => {
      let node = {
        include: ['a'],
        populate: {
          b: {
            localField: 'b',
            include: ['x', 'y'],
          },
        },
      }
      expect(() => checkPopulate(node)).toThrowError()
    })
    it('should not throw on an unincluded child path if a parent is included', () => {
      let node = {
        include: ['createdBy', '_createdByOrganization'],
        populate: {
          createdBy: {
            localField: 'createdBy',
            include: ['_id', 'firstName', 'lastName'],
          },
          _createdByOrganization: {
            localField: 'createdBy.organization',
          },
        },
      }
      expect(() => checkPopulate(node)).not.toThrowError()
    })

    it('should not throw when include checks out', () => {
      let node = {
        include: ['createdBy', '_createdByOrganization'],
        populate: {
          createdBy: {
            localField: 'createdBy',
            include: ['_id', 'firstName', 'lastName', 'organization'],
          },
          _createdByOrganization: {
            localField: 'createdBy.organization',
          },
        },
      }
      expect(() => checkPopulate(node)).not.toThrowError()
    })
    it('should not throw when include is an empty array and the schema contains the fields', () => {
      let node = {
        include: [],
        populate: {
          createdBy: {
            localField: 'createdBy',
            include: ['_id', 'firstName', 'lastName', 'organization'],
          },
          _createdByOrganization: {
            localField: 'createdBy.organization',
          },
        },
      }
      let schema = { fields: { createdBy: true, _createdByOrganization: true } }
      expect(() => checkPopulate(node, schema)).not.toThrowError()
    })
  })
})
