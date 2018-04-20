import Contexture from 'contexture'
import { exampleTypes } from 'contexture-client'
import elasticsearch from 'elasticsearch-browser'
import contextureES from 'contexture-elasticsearch'
import contextureESTypes from 'contexture-elasticsearch/src/types'
import ContextureMobx from '../../src/utils/contexture-mobx'

export let updateClient = config => {
  es.client = elasticsearch.Client(config)
}
// Mutable objects so we can update later
export let es = { client: {} }
export let schemas = {}
export default ContextureMobx({
  // debug: true,
  types: exampleTypes,
  service: Contexture({
    schemas,
    providers: {
      elasticsearch: contextureES({
        getClient: () => es.client,
        types: contextureESTypes(),
      }),
    },
  })
})
