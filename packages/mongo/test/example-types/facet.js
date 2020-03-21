let { expect } = require('chai')
let _ = require('lodash/fp')
let facet = require('../../src/example-types/facet')
let mingo = require('mingo')

describe('facet', () => {
  describe('facet.hasValue', () => {
    it('Should allow nodes with values', () => {
      expect(
        facet.hasValue({
          values: [1, 2],
        })
      ).to.equal(2)
    })
    it('Should not allow nodes with values', () => {
      expect(
        facet.hasValue({
          values: [],
        })
      ).to.equal(0)
    })
  })
  describe('facet.result', () => {
    let queries = []
    let search = async query => {
      queries.push(query)
      return [1, 2, 3].map(i => ({ _id: `${i}`, count: i }))
    }
    it('should call the search function and wait for it', async () => {
      queries = []
      let node = {
        field: 'myField',
      }
      let result = await facet.result(node, search)
      expect(result.options.length).to.equal(3)
      expect(_.every(x => _.isNumber(x.count), result.options)).to.equal(true)
    })
    it('should default the limit query to 10 if size is not provided', async () => {
      queries = []
      let node = {
        field: 'myField',
      }
      await facet.result(node, search)
      let limitAgg = _.find('$limit', queries[0])
      expect(limitAgg.$limit).to.equal(10)
    })
    it('should allow unlimited queries', async () => {
      queries = []
      let node = {
        field: 'myField',
        size: 0,
      }
      await facet.result(node, search)
      let limitAgg = _.find('$limit', queries[0])
      expect(limitAgg).to.be.undefined
    })
    it('should support optionsFilter', async () => {
      queries = []
      let node = {
        field: 'myField',
        optionsFilter: 'cable',
      }
      await facet.result(node, search)
      let filterAgg = _.find('$match', queries[0])
      expect(filterAgg).to.deep.equal({
        $match: {
          _id: {
            $regex: '.*(?=.*cable.*).*',
            $options: 'i',
          },
        },
      })
      // Also make sure that options filtering happens _before_ limiting
      let filterIndex = _.findIndex('$match', queries[0])
      let limitIndex = _.findIndex('$limit', queries[0])
      expect(limitIndex > filterIndex).to.be.true
    })
    it('should support optionsFilter with multiple words and spaces', async () => {
      queries = []
      let node = {
        field: 'categoriesInfo',
        optionsFilter: '  dis  comp    ',
      }
      await facet.result(node, search)
      let filterAgg = _.find('$match', queries[0])
      expect(filterAgg).to.deep.equal({
        $match: {
          _id: {
            $regex: '.*(?=.*dis.*)(?=.*comp.*).*',
            $options: 'i',
          },
        },
      })
      // Also make sure that options filtering happens _before_ limiting
      let filterIndex = _.findIndex('$match', queries[0])
      let limitIndex = _.findIndex('$limit', queries[0])
      expect(limitIndex > filterIndex).to.be.true
    })
    it('should support isMongoId', async () => {
      let node = {
        field: 'field',
        values: ['5a4ea8052c635b002ade8e45', '5a4ea8052c635b002ade8e45'],
      }
      let result = await facet.filter(node)
      expect(result.field.$in.map(x => x.toString())).to.deep.equal([
        '5a4ea8052c635b002ade8e45',
        '5a4ea8052c635b002ade8e45',
      ])
    })
    it('should support label lookup', async () => {
      let activities = [
        { _id: 1, type: 'create', user: 2 },
        { _id: 1, type: 'update', user: 1 },
        { _id: 1, type: 'create', user: 1 },
        { _id: 1, type: 'delete', user: 3 },
        { _id: 1, type: 'delete', user: 2 },
        { _id: 1, type: 'read', user: 1 },
      ]

      let users = [
        { _id: 1, name: 'Fred', type: 'basic' },
        { _id: 2, name: 'Jane', type: 'admin' },
      ]

      let node = {
        field: 'user',
        label: {
          collection: users,
          foreignField: '_id',
          fields: ['name']
        }
      }

      let result = await facet.result(node, agg => mingo.aggregate(activities, agg) )

      expect(result).to.deep.equal({
        cardinality: 3,
        options: [
          { name: 1, label: { name: 'Fred' }, count: 3 },
          { name: 2, label: { name: 'Jane' }, count: 2 },
          { name: 3, count: 1 }
        ]
      })
    })
  })
})
