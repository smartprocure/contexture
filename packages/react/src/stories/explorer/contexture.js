import F from 'futil'
import Contexture from 'contexture'
import { exampleTypes } from 'contexture-client'
import elasticsearch from 'elasticsearch-browser'
import contextureES from 'contexture-elasticsearch'
import contextureESTypes from 'contexture-elasticsearch/types.js'
import { exampleTypeSchemaMapping } from 'contexture-elasticsearch/example-types/schemaMapping.js'
import ContextureMobx from '../../utils/contexture-mobx.js'

export let es = { client: {} }
export let updateClient = (config) => {
  es.client = elasticsearch.Client(config)
  return updateSchemas()
}
let elasticsearchProvider = contextureES({
  getClient: () => es.client,
  types: contextureESTypes(),
})

export let schemas = {}
export let updateSchemas = async () => {
  console.info('Dynamically reading elasticsearch schemas')
  let result = exampleTypeSchemaMapping(
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
