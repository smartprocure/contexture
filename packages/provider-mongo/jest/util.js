import _ from 'lodash/fp.js'
import { MongoClient } from 'mongodb'

export const mongoClient = {
  async connect() {
    console.log({ MONGO_URI: process.env.MONGO_URI })
    global.__mongoClient = await MongoClient.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  },
  async disconnect() {
    await global.__mongoClient.close()
  },
}

export const usingCollections = async (cb) => {
  const db = global.__mongoClient.db()
  const numberOfArguments = cb.length
  const collections = _.times(
    () => db.collection(Math.random().toString(20).substr(2, 12)),
    numberOfArguments
  )
  try {
    await cb(...collections)
  } finally {
    await Promise.all(_.map((coll) => coll.drop(), collections))
  }
}
