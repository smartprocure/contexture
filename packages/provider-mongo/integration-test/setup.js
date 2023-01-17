import { ObjectID, MongoClient } from 'mongodb'
import _ from 'lodash/fp.js'

MongoClient.max_delay = 0

let url = 'mongodb://localhost/contexture-test'

export default async ({ collection: collectionName }) => {
  let db = await MongoClient.connect(url, {})
  let collection = db.collection(collectionName)

  let ids = [new ObjectID(), new ObjectID(), new ObjectID()]

  let count = 0
  let docs = _.map(
    _id => ({
      _id,
      code: `${++count}${count}${count + 1}${count + 1}${count + 2}${
        count + 2
      }`,
      nextCode: ids[count] || ids[0],
    }),
    ids
  )

  await collection.remove({})
  await collection.insertMany(docs)

  afterAll(() => collection.remove({}))

  return {
    db,
    ids,
  }
}
