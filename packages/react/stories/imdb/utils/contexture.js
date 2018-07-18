import _ from 'lodash/fp'
import * as F from 'futil-js'
import Contexture from 'contexture'
import { exampleTypes } from 'contexture-client'
import elasticsearch from 'elasticsearch-browser'
import contextureES from 'contexture-elasticsearch'
import contextureESTypes from 'contexture-elasticsearch/src/types'
import typeMap from 'contexture-elasticsearch/src/example-types/schemaMapping'
import ContextureMobx from '../../../src/utils/contexture-mobx'

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
  console.log('Dynamically reading elasticsearch schemas')
  let result = typeMap.exampleTypeSchemaMapping(
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
