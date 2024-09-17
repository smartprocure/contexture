import _ from 'lodash/fp.js'
import Contexture from 'contexture'
// import provider from 'contexture-elasticsearch'
// import types from 'contexture-elasticsearch/types.js'
import Provider from '../../src/index.js'
import types from '../../src/types.js'
import { Client } from '@elastic/elasticsearch'
import AgentKeepAlive from 'agentkeepalive'
import { describe, expect, it } from 'vitest'


describe('Integration Tests', () => {
  it.skip('should work?', async function () {
    this.timeout(10000)
    // Setup
    let getClient = _.memoize(
      () =>
        new Client({
          node:
            //'http://test-elasticsearch-master.default.svc.cluster.local:9200',
            'http://elasticsearch-prod-client.default.svc.cluster.local:9200',
          // apiVersion: '6.3',

          // This is an example config, see the elasticsearch js docs for more
          minSockets: 1,
          maxSockets: 20,
          keepAlive: true,
          createNodeAgent: (connection, config) =>
            new AgentKeepAlive(connection.makeAgentConfig(config)),
        })
    )
    let provider = Provider({
      getClient,
      types: types({
        // geo: { geocodeLocation: query => googleplaces.textSearch({ query }) },
      }),
    })
    let esClient = getClient()
    await esClient.ping()

    let schemas = await provider.getSchemas()
    let process = Contexture({
      schemas,
      providers: { elasticsearch: provider },
    })

    let tree = {
      key: 'root',
      schema: 'sp-data-lit',
      children: [
        {
          key: 'criteria',
          children: [
            {
              key: 'states',
              field: 'Organization.State',
              type: 'facet',
              values: ['Florida'],
              filterOnly: true,
            },
            // {
            //   key: 'prices',
            //   field: 'LineItem.UnitPrice',
            //   type: 'number',
            //   findBestRange: true,
            // },
          ],
        },
        // { key: 'results', type: 'results' },
        // {
        //   key: 'spendingOverTime',
        //   type: 'dateIntervalGroupStats',
        //   groupField: 'PO.IssuedDate',
        //   statsField: 'PO.IssuedAmount',
        // },
        // {
        //   key: 'toptypes',
        //   type: 'fieldValuesGroupStats',
        //   groupField: 'PO.IssuedDate',
        //   statsField: 'PO.IssuedAmount',
        // },
        {
          key: 'pivot!',
          type: 'pivot',
          flatten: true,
          values: [{ field: 'PO.IssuedAmount', type: 'avg' }],
          groups: [
            { field: 'Organization.NameState', type: 'fieldValues' },
            // { field: 'PO.IssuedDate', type: 'dateInterval', interval: 'year' },
            // { type:'numberInterval', field: 'PO.IssuedAmount' }
          ],
        },
      ],
    }
    let result = await process(tree)
    console.info(JSON.stringify(result, 0, 2))

    // console.info(result.children[1].context)
    // console.info(result.children[2].context)
    // console.info(result.children[0].children[1].context)
  })
})
