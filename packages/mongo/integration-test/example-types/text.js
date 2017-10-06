let { expect } = require('chai')
let types = require('../../types')()
let MongoClient = require('mongodb').MongoClient
let ObjectID = require('mongodb').ObjectID
let Promise = require('bluebird')
let Contexture = require('contexture')
let provider = require('../../src')
let _ = require('lodash/fp')
let util = require('util')

MongoClient.max_delay = 0
let url = 'mongodb://localhost/contexture-test';
let schemaName = 'Things'
let collectionName = 'thing'
let field = 'code'

let db

before(done => {
  MongoClient.connect(url, {}, (err, _db) => {
    db = _db
    done()
  })
})

describe('Grouping text', () => {
  it('should work', async () => {
    let collection = db.collection(collectionName)
    let docs = [{
      _id: new ObjectID(),
      code: '112233'
    }, {
      _id: new ObjectID(),
      code: '223344'
    }, {
      _id: new ObjectID(),
      code: '334455'
    }]
    await collection.remove({})
    await collection.insertMany(docs)

    let process = Contexture({
      schemas: {
        [schemaName]: {
          mongo: {
            collection: collectionName
          }
        }
      },
      providers: {
        mongo: provider({
          getClient: () => db,
          types
        })
      }
    })

    let expectedCode = '112233'

    let dsl = {
      type: 'group',
      schema: schemaName,
      join: 'and',
      items: [{
        key: 'text',
        type: 'text',
        field,
        data: {
          operator: 'is',
          value: expectedCode
        }
      }, {
        key: 'results',
        type: 'results'
      }]
    }

    let context = await process(dsl, { debug: true })
    let response = _.last(context.items).context.response
    expect(response.totalRecords).to.equal(1)
    expect(response.results[0].code).to.equal(expectedCode)
  })
})
