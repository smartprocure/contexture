import * as F from 'futil-js'
import Contexture from 'contexture'
import { exampleTypes } from 'contexture-client'
import elasticsearch from 'elasticsearch-browser'
import contextureES from 'contexture-elasticsearch'
import contextureESTypes from 'contexture-elasticsearch/src/types'
import typeMap from 'contexture-elasticsearch/src/example-types/schemaMapping'
import ContextureMobx from '../../src/utils/contexture-mobx'

export let es = { client: {} }
export let updateClient = config => {
  es.client = elasticsearch.Client(config)
  return updateSchemas()
}
let elasticsearchProvider = contextureES({
  getClient: () => es.client,
  types: contextureESTypes(),
})

export let schemas = {}
export let updateSchemas = async () => {
  console.log('Dynamically reading elasticsearch schemas')
  let result = typeMap.exampleTypeSchemaMapping(
    await elasticsearchProvider.getSchemas()
  ) 
  F.mergeOn(schemas, result)
  return result
}

export default ContextureMobx({
  // debug: true,
  types: exampleTypes,
  service: Contexture({
    schemas,
    providers: { elasticsearch: elasticsearchProvider },
  }),
})
