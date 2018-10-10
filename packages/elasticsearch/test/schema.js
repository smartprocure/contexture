let _ = require('lodash/fp')

let { fromMappingsWithAliases } = require('../src/schema')
let { exampleTypeSchemaMapping } = require('../src/example-types/schemaMapping')
let { expect } = require('chai')

let imdbMapping = require('./schema-data/imdb-mapping')
let imdbAliases = require('./schema-data/imdb-aliases')
let imdbSchema = require('./schema-data/imdb-schema')

let processSchemas = _.flow(fromMappingsWithAliases, exampleTypeSchemaMapping)

describe('schemas', () => {
  it('should work with imdb', () => {
    let result = processSchemas(imdbMapping, imdbAliases)
    //console.log(JSON.stringify(result))
    expect(result).to.deep.equal(imdbSchema)
  })
})
