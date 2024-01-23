import _ from 'lodash/fp.js'
import F from 'futil'
import Contexture from 'contexture'
import { exampleTypes } from 'contexture-client'
import elasticsearch from 'elasticsearch-browser'
import contextureES from 'contexture-elasticsearch'
import contextureESTypes from 'contexture-elasticsearch/types.js'
import { exampleTypeSchemaMapping } from 'contexture-elasticsearch/example-types/schemaMapping.js'
import ContextureMobx from '../../../utils/contexture-mobx.js'

export let esClient = elasticsearch.Client({
  apiVersion: '6.0',
  host: 'https://public-es-demo.smartprocure.us/',
})
export let types = exampleTypes

let elasticsearchProvider = contextureES({
  getClient: () => esClient,
  types: contextureESTypes(),
})

export let schemas = {
  movies: {
    elasticsearch: {
      index: 'movies',
      type: 'movie',
    },
    modeMap: {
      word: '',
      autocomplete: '.keyword',
    },
  },
}
export let updateSchemas = _.memoize(async () => {
  console.info('Dynamically reading elasticsearch schemas')
  let result = exampleTypeSchemaMapping(
    await elasticsearchProvider.getSchemas()
  )
  F.mergeOn(schemas, result)
  return result
})

export let service = Contexture({
  schemas,
  providers: { elasticsearch: elasticsearchProvider },
})
export default ContextureMobx({
  // debug: true,
  types,
  service,
})
