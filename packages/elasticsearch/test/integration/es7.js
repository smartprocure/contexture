let _ = require('lodash/fp')
let Contexture = require('contexture')
// let provider = require('contexture-elasticsearch')
// let types = require('contexture-elasticsearch/types')
let Provider = require('../../src/index')
let types = require('../../src/types')
let elasticsearch = require('@elastic/elasticsearch')
let AgentKeepAlive = require('agentkeepalive')

describe('Integration Tests', () => {
  it.skip('should work?', async function() {
    this.timeout(10000)
    // Setup
    let getClient = _.memoize(
      () =>
        new elasticsearch.Client({
          node:
            'http://test-elasticsearch-master.default.svc.cluster.local:9200',
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
              values: ['FL'],
            },
            {
              key: 'prices',
              field: 'LineItem.UnitPrice',
              type: 'number',
              findBestRange: true,
            }
          ],
        },
        { key: 'results', type: 'results' },
        {
          key: 'spendingOverTime',
          type: 'dateIntervalGroupStats',
          groupField: 'PO.IssuedDate',
          statsField: 'PO.IssuedAmount',
        },
        {
          key: 'toptypes',
          type: 'fieldValuesGroupStats',
          groupField: 'PO.IssuedDate',
          statsField: 'PO.IssuedAmount',
        },
      ],
    }
    let result = await process(tree)
    console.info(result.children[1].context)
    console.info(result.children[2].context)
    console.info(result.children[0].children[1].context)
  })
})
