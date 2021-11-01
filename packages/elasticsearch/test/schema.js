let _ = require('lodash/fp')
let { expect } = require('chai')

let aliases = require('./schema-data/aliases')
let mappingWithNonObjects = require('./schema-data/mapping-with-non-objects')
let mappingWithoutTypes = require('./schema-data/mapping-without-types')
let mappingWithTypes = require('./schema-data/mapping-with-types')
let schemaWithoutTypes = require('./schema-data/schema-without-types')
let schemaWithTypes = require('./schema-data/schema-with-types')
let { fromMappingsWithAliases } = require('../src/schema')
let { exampleTypeSchemaMapping } = require('../src/example-types/schemaMapping')

let processSchemas = _.flow(fromMappingsWithAliases, exampleTypeSchemaMapping)

describe('processSchemas()', () => {
  // es5, es6, es7
  it('should return the correct schema, given an ES mapping with non-object properties,', () => {
    let expected = schemaWithoutTypes
    let actual = processSchemas(mappingWithNonObjects, aliases)
    expect(actual).to.deep.equal(expected)
  })

  // es5, es6, es7 (with GET INDEX/_mapping?include_type_name)
  it('should return the correct schema, given an ES mapping with types,', () => {
    let expected = schemaWithTypes
    let actual = processSchemas(mappingWithTypes, aliases)
    expect(actual).to.deep.equal(expected)
  })

  // es7
  it('should return the correct schema, when given an ES mapping without types,', () => {
    let expected = schemaWithoutTypes
    let actual = processSchemas(mappingWithoutTypes, aliases)
    expect(actual).to.deep.equal(expected)
  })
})
