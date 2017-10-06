let ObjectID = require('mongodb').ObjectID
let MongoClient = require('mongodb').MongoClient
let _ = require('lodash/fp')

MongoClient.max_delay = 0

let url = 'mongodb://localhost/contexture-test';

module.exports = async ({collection: collectionName}) => {
  let db = await MongoClient.connect(url, {})
  let collection = db.collection(collectionName)

  let ids = [
    new ObjectID(),
    new ObjectID(),
    new ObjectID(),
  ]

  let count = 0
  let docs = _.map(_id => ({
    _id,
    code: `${++count}${count}${count+1}${count+1}${count+2}${count+2}`
  }), ids)

  await collection.remove({})
  await collection.insertMany(docs)

  after(() => collection.remove({}))

  return {
    db,
    ids,
  }
}
