let { expect } = require('chai')
let types = require('../../types')()
let Contexture = require('contexture')
let provider = require('../../src')
let _ = require('lodash/fp')
let testSetup = require('../setup')

let schemaName = 'Documents'
let collection = 'document'

let contextureTestSetup = async ({collection}) => {
  let {db, ids} = await testSetup({collection})
  return {
    db,
    ids,
    process: Contexture({
      schemas: {
        [schemaName]: {
          mongo: {
            collection
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
  }
}

describe('Grouping text and mongoId', () => {
  it('should work', async () => {
    let {ids: [id], process} = await contextureTestSetup({collection})
    let dsl = {
      type: 'group',
      schema: schemaName,
      join: 'and',
      items: [{
        key: 'text',
        type: 'text',
        field: 'code',
        data: {
          operator: 'containsWord',
          value: '22'
        }
      }, {
        key: 'specificUser',
        type: 'mongoId',
        field: '_id',
        data: {
          value: id
        }
      }, {
        key: 'results',
        type: 'results'
      }]
    }
    let context = await process(dsl, { debug: true })
    let response = _.last(context.items).context.response
    expect(response.totalRecords).to.equal(1)
    expect(response.results[0]._id.toString()).to.equal(id.toString())
  })

  it('should work with populate', async () => {
    let {ids: [id, id2], process} = await contextureTestSetup({collection})
    let dsl = {
      type: 'group',
      schema: schemaName,
      join: 'and',
      items: [{
        key: 'text',
        type: 'text',
        field: 'code',
        data: {
          operator: 'containsWord',
          value: '22'
        }
      }, {
        key: 'specificUser',
        type: 'mongoId',
        field: '_id',
        data: {
          value: id
        }
      }, {
        key: 'results',
        type: 'results',
        config: {
          populate: {
            child: {
              schema: 'Documents',
              foreignField: '_id',
              localField: 'nextCode'
            }
          }
        }
      }]
    }
    let context = await process(dsl, { debug: true })
    let response = _.last(context.items).context.response
    expect(response.totalRecords).to.equal(1)
    expect(response.results[0]._id.toString()).to.equal(id.toString())
    expect(response.results[0].child[0]._id.toString()).to.equal(id2.toString())
  })
})
