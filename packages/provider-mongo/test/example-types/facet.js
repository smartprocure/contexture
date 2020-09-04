let { expect } = require('chai')
let _ = require('lodash/fp')
let facet = require('../../src/example-types/facet')
let { ObjectID } = require('mongodb')
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
    it('should sort and limit results as early as possible if there is no search, for performance benefits', async () => {
      queries = []
      let node = {
        field: 'myField',
        label: 'myField',
      }

      await facet.result(node, search)

      let sortIndex = _.findIndex('$sort', queries[0])
      let limitIndex = _.findIndex('$limit', queries[0])

      let lastIndex = queries[0].length - 1
      let secondToLastIndex = lastIndex - 1

      expect(limitIndex > sortIndex).to.be.true
      expect(sortIndex < secondToLastIndex).to.be.true
      expect(limitIndex < lastIndex).to.be.true
    })
    it('should sort and limit results later in the pipeline if there is a facet search', async () => {
      queries = []
      let node = {
        field: 'myField',
        label: 'myField',
        optionsFilter: 'keyword',
      }

      await facet.result(node, search)

      let sortIndex = _.findIndex('$sort', queries[0])
      let limitIndex = _.findIndex('$limit', queries[0])

      let lastIndex = queries[0].length - 1
      let secondToLastIndex = lastIndex - 1

      expect(limitIndex > sortIndex).to.be.true
      expect(sortIndex === secondToLastIndex).to.be.true
      expect(limitIndex === lastIndex).to.be.true
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
    it('should support string label lookups', async () => {
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
          fields: 'name',
        },
      }

      let result = await facet.result(node, agg =>
        mingo.aggregate(activities, agg)
      )

      expect(result).to.deep.equal({
        cardinality: 3,
        options: [
          { name: 1, label: 'Fred', count: 3 },
          { name: 2, label: 'Jane', count: 2 },
          { name: 3, count: 1 },
        ],
      })
    })
    it('should support array label lookups', async () => {
      let activities = [
        { _id: 1, type: 'create', user: 2 },
        { _id: 1, type: 'update', user: 1 },
        { _id: 1, type: 'create', user: 1 },
        { _id: 1, type: 'delete', user: 3 },
        { _id: 1, type: 'delete', user: 2 },
        { _id: 1, type: 'read', user: 1 },
      ]

      let users = [
        { _id: 1, firstName: 'Fred', lastName: 'Smith', type: 'basic' },
        { _id: 2, firstName: 'Jane', lastName: 'Williams', type: 'admin' },
      ]

      let node = {
        field: 'user',
        label: {
          collection: users,
          foreignField: '_id',
          fields: ['firstName', 'lastName'],
        },
      }

      let result = await facet.result(node, agg =>
        mingo.aggregate(activities, agg)
      )

      expect(result).to.deep.equal({
        cardinality: 3,
        options: [
          {
            name: 1,
            label: { firstName: 'Fred', lastName: 'Smith' },
            count: 3,
          },
          {
            name: 2,
            label: { firstName: 'Jane', lastName: 'Williams' },
            count: 2,
          },
          { name: 3, count: 1 },
        ],
      })
    })
    it('should ignore label lookup when not present', async () => {
      let activities = [
        { _id: 1, type: 'create', user: 2 },
        { _id: 1, type: 'update', user: 1 },
        { _id: 1, type: 'create', user: 1 },
        { _id: 1, type: 'delete', user: 3 },
        { _id: 1, type: 'delete', user: 2 },
        { _id: 1, type: 'read', user: 1 },
      ]

      let node = {
        field: 'user',
      }

      let result = await facet.result(node, agg =>
        mingo.aggregate(activities, agg)
      )

      expect(result).to.deep.equal({
        cardinality: 3,
        options: [
          { name: 1, count: 3 },
          { name: 2, count: 2 },
          { name: 3, count: 1 },
        ],
      })
    })
    it('should support optionsFilter with a lookup that returns a single field', async () => {
      queries = []

      let activities = [
        { _id: 1, type: 'create', user: 2 },
        { _id: 1, type: 'update', user: 1 },
        { _id: 1, type: 'create', user: 1 },
        { _id: 1, type: 'delete', user: 3 },
        { _id: 1, type: 'delete', user: 2 },
        { _id: 1, type: 'read', user: 1 },
      ]

      let users = [
        { _id: 1, firstName: 'Fred', type: 'basic' },
        { _id: 2, firstName: 'Jane', type: 'admin' },
      ]

      let node = {
        field: 'user',
        optionsFilter: 'jane',
        label: {
          collection: users,
          foreignField: '_id',
          fields: 'firstName',
        },
      }

      await facet.result(node, search)
      let filterAgg = _.find('$match', queries[0])
      expect(filterAgg).to.deep.equal({
        $match: {
          'label.firstName': {
            $regex: '.*(?=.*jane.*).*',
            $options: 'i',
          },
        },
      })

      let result = await facet.result(node, agg =>
        mingo.aggregate(activities, agg)
      )

      expect(result).to.deep.equal({
        cardinality: 3,
        options: [
          {
            name: 2,
            label: 'Jane',
            count: 2,
          },
        ],
      })
    })
    it('should support a lookup with an optionsFilter with multiple keywords that span multiple fields', async () => {
      queries = []

      let activities = [
        { _id: 1, type: 'create', user: 2 },
        { _id: 1, type: 'update', user: 1 },
        { _id: 1, type: 'create', user: 1 },
        { _id: 1, type: 'delete', user: 3 },
        { _id: 1, type: 'delete', user: 2 },
        { _id: 1, type: 'read', user: 1 },
      ]

      let users = [
        { _id: 1, firstName: 'Fred', lastName: 'Smith', type: 'basic' },
        { _id: 2, firstName: 'Jane', lastName: 'Williams', type: 'admin' },
      ]

      let node = {
        field: 'user',
        optionsFilter: 'fred smith',
        label: {
          collection: users,
          foreignField: '_id',
          fields: ['firstName', 'lastName'],
        },
      }

      await facet.result(node, search)
      let filterAgg = _.find('$match', queries[0])
      expect(filterAgg).to.deep.equal({
        $match: {
          $and: [
            {
              $or: [
                {
                  'label.firstName': {
                    $regex: '.*(?=.*fred.*).*',
                    $options: 'i',
                  },
                },
                {
                  'label.lastName': {
                    $regex: '.*(?=.*fred.*).*',
                    $options: 'i',
                  },
                },
              ],
            },
            {
              $or: [
                {
                  'label.firstName': {
                    $regex: '.*(?=.*smith.*).*',
                    $options: 'i',
                  },
                },
                {
                  'label.lastName': {
                    $regex: '.*(?=.*smith.*).*',
                    $options: 'i',
                  },
                },
              ],
            },
          ],
        },
      })

      let result = await facet.result(node, agg =>
        mingo.aggregate(activities, agg)
      )

      expect(result).to.deep.equal({
        cardinality: 3,
        options: [
          {
            name: 1,
            label: { firstName: 'Fred', lastName: 'Smith' },
            count: 3,
          },
        ],
      })
    })
    it('should allow for an optional node.unwind to distinguish a nested array field being searched', async () => {
      let collection = [
        {
          _id: 1,
          myFields: [
            {
              _id: 5,
              field: 'firstField',
            },
          ],
        },
        {
          _id: 2,
          myFields: [
            {
              _id: 6,
              field: 'firstField',
            },
            {
              _id: 7,
              field: 'secondField',
            },
          ],
        },
      ]

      let node = {
        field: 'myFields.field',
        unwind: 'myFields',
      }

      let result = await facet.result(node, agg =>
        mingo.aggregate(collection, agg)
      )

      expect(result).to.deep.equal({
        cardinality: 2,
        options: [
          { name: 'firstField', count: 2 },
          { name: 'secondField', count: 1 },
        ],
      })
    })

    describe('should always include checked values', () => {


      let Data = [
        { _id: 1, name: '1' },
        { _id: 2, name: '2' },
        { _id: 3, name: '3' },
        { _id: 4, name: '4' },
      ]
      let mongoIdData = [
        { _id: '5e9dbd76e991760021124966', name: 'Automation' },
        { _id: '5cde2658dc766b0030c67dae', name: 'Fowlkes (MO)' },
        { _id: '5d1ca49436e1d20038f8c84f', name: 'Customer Experience' },
        { _id: '5ce30b403aa154002d01b9ed', name: 'Government Division' },
      ]
     let node = {
        key: 'id',
        field: '_id',
        type: 'facet',
       label:{
         collection:null,
         foreignField: '_id',
         fields: ['name'],
       },
        mode: 'include',
        optionsFilter: '',
        size: 2,
      }
      it('when there are missed values', async() => {

        node.label.collection= Data,

        node.values = [4]

        let result = await facet.result(node, agg =>
          mingo.aggregate(Data, agg)
        )
        let ids = _.map(({ name }) => _.toString(name), result.options)
        expect(result.options.length).to.equal(2)
        expect(_.includes('4', ids)).to.be.true
      })
      it('when there is no missed value', async() => {
        node.label.collection= Data,
        node.values = [1]
        let result = await facet.result(node, agg =>
          mingo.aggregate(Data, agg)
        )
        let ids = _.map(({ name }) => _.toString(name), result.options)
        expect(result.options.length).to.equal(2)
        expect(_.includes('1', ids)).to.be.true
      })
      it('when there are missed values and isMongoId: true', async() => {
        let collection = _.map(
          ({ _id, name }) => ({ _id: ObjectID(_id), name }),
          mongoIdData
        )
        node.isMongoId= true
        node.label.collection= collection,
        node.values = ['5ce30b403aa154002d01b9ed']

        let result = await facet.result(node, agg =>
          mingo.aggregate(collection, agg)
        )
        let ids = _.map(({ name }) => _.toString(name), result.options)

        expect(result.options.length).to.equal(2)
        expect(_.includes('5ce30b403aa154002d01b9ed', ids)).to.be.true
      })
      it('when there is no missed value and isMongoId: true', async() => {
        let collection = _.map(
          ({ _id, name }) => ({ _id: ObjectID(_id), name }),
          mongoIdData
        )
        node.isMongoId= true
        node.label.collection= collection,
        node.values = ['5e9dbd76e991760021124966']

        let result = await facet.result(node, agg =>
          mingo.aggregate(collection, agg)
        )
        let ids = _.map(({ name }) => _.toString(name), result.options)

        expect(result.options.length).to.equal(2)
        expect(_.includes('5e9dbd76e991760021124966', ids)).to.be.true
      })


    })

  })
})
