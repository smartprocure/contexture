let { expect } = require('chai')
let { text } = require('../../types')()
let MongoClient = require('mongo-mock').MongoClient
let ObjectID = require('mongodb').ObjectID
let Promise = require('bluebird')
let Contexture = require('contexture')
let provider = require('../../src')
let _ = require('lodash/fp')

MongoClient.max_delay = 0
let url = 'mongodb://localhost:27017/myproject'

let db

before(done => {
  MongoClient.connect(url, {}, (err, _db) => {
    db = _db
    done()
  })
})

describe('Grouping text', () => {
  it.only('should work', async () => {
    let collection = db.collection('documents')
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
    await Promise.promisify(collection.insert)(docs)

    let process = Contexture({
      schemas: {
        Documents: {
          mongo: {
            collection: 'documents'
          }
        }
      },
      providers: {
        mongo: provider({
          getClient: () => db,
          types: {
            text
          }
        })
      }
    })

    let dsl = {
      type: 'group',
      schema: 'Documents',
      join: 'and',
      items: [{
        key: 'text',
        type: 'text',
        field: 'code',
        data: {
          operator: 'is',
          value: '112233'
        }
      }, {
        key: 'results',
        type: 'results'
      }]
    }

    let context = await process(dsl, { debug: true })
    console.log('RESULT', context)
    console.log('RESPONSES', _.map('response', context.items[dsl.items.length - 1]._meta.requests))
    console.log('DSL', dsl.items)
  })
})
