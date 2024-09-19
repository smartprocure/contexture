import { vi, describe, expect, it } from 'vitest'
import _ from 'lodash/fp.js'

import aliases from './schema-data/aliases.js'
import mappingWithNonObjects from './schema-data/mapping-with-non-objects.js'
import mappingWithoutTypes from './schema-data/mapping-without-types.js'
import mappingWithTypes from './schema-data/mapping-with-types.js'
import schemaWithoutTypes from './schema-data/schema-without-types.js'
import schemaWithTypes from './schema-data/schema-with-types.js'
import { fromMappingsWithAliases } from './schema.js'
import { exampleTypeSchemaMapping } from './example-types/schemaMapping.js'

let processSchemas = _.flow(fromMappingsWithAliases, exampleTypeSchemaMapping)

describe('processSchemas()', () => {
  // es5, es6, es7
  it('should return the correct schema, given an ES mapping with non-object properties,', () => {
    let expected = schemaWithoutTypes
    let actual = processSchemas(mappingWithNonObjects, aliases)
    expect(actual).toEqual(expected)
  })

  // es5, es6, es7 (with GET INDEX/_mapping?include_type_name)
  it('should return the correct schema, given an ES mapping with types,', () => {
    let expected = schemaWithTypes
    let actual = processSchemas(mappingWithTypes, aliases)
    expect(actual).toEqual(expected)
  })

  // es7
  it('should return the correct schema, when given an ES mapping without types,', () => {
    let expected = schemaWithoutTypes
    let actual = processSchemas(mappingWithoutTypes, aliases)
    expect(actual).toEqual(expected)
  })
})
