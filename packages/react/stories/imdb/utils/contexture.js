import Contexture from 'contexture'
import {exampleTypes} from 'contexture-client'
import elasticsearch from 'elasticsearch-browser'
import contextureES from 'contexture-elasticsearch'
import contextureESTypes from 'contexture-elasticsearch/src/types'
import ContextureMobx from '../../../src/utils/contexture-mobx'

export let esClient = elasticsearch.Client({
  apiVersion: '6.0',
  host: 'https://public-es-demo.smartprocure.us/',
})
export let types = exampleTypes
export let service = Contexture({
  schemas: {
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
  },
  providers: {
    elasticsearch: contextureES({
      getClient: () => esClient,
      types: contextureESTypes(),
    }),
  },
})
export default ContextureMobx({
  // debug: true,
  types,
  service,
})
