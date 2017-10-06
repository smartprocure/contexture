let { expect } = require('chai')
let types = require('../../types')()
let Promise = require('bluebird')
let Contexture = require('contexture')
let provider = require('../../src')
let _ = require('lodash/fp')
let util = require('util')
let testSetup = require('../setup')

let schemaName = 'Documents'
let collection = 'document'

describe('Grouping text and mongoId', () => {
  it('should work', async () => {
    let {db} = await testSetup({collection})

    let process = Contexture({
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

    let expectedCode = '112233'

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
        key: 'results',
        type: 'results'
      }]
    }

    let context = await process(dsl, { debug: true })
    let response = _.last(context.items).context.response
    expect(response.totalRecords).to.equal(2)
    expect(_.map('code', response.results)).to.deep.equal([
      '112233',
      '223344',
    ])
  })
})
