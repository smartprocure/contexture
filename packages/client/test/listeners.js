import _ from 'lodash/fp'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import ContextureClient from '../src'
import mockService from '../src/mockService'
import { observable, toJS, set } from 'mobx'
const expect = chai.expect
chai.use(sinonChai)

let mobxAdapter = { snapshot: toJS, extend: set, initObject: observable }
let ContextureMobx = _.curry((x, y) =>
  ContextureClient({ ...mobxAdapter, ...x })(y)
)

let AllTests = ContextureClient => {
  describe('listeners', () => {
    it('watchNode', async () => {
      let service = sinon.spy(mockService({ delay: 10 }))
      let tree = ContextureClient(
        { service, debounce: 1 },
        {
          key: 'root',
          join: 'and',
          children: [
            {
              key: 'filter',
              type: 'facet',
              field: 'facetfield',
              values: ['some value'],
            },
            { key: 'results', type: 'results' },
          ],
        }
      )
      let filterDom = ''
      let resultsDom = ''
      let filterWatcher = sinon.spy(node => {
        filterDom = `<div>
  <h1>Facet</h1>
  <b>Field: ${node.field}</>
  values: ${_.join(', ', node.values)}
</div>`
      })
      let resultWatcher = sinon.spy((node, delta) => {
        resultsDom = `<table>${_.map(
          result =>
            `\n<tr>${_.map(val => `<td>${val}</td>`, _.values(result))}</tr>`,
          node.context.results
        )}
</table>`
      })
      tree.watchNode(['root', 'filter'], filterWatcher)
      tree.watchNode(['root', 'results'], resultWatcher)
      expect(filterDom).to.equal('')
      let action = tree.mutate(['root', 'filter'], { values: ['other Value'] })
      expect(filterDom).to.equal(`<div>
  <h1>Facet</h1>
  <b>Field: facetfield</>
  values: other Value
</div>`)
      expect(resultsDom).to.equal(`<table>\n</table>`)
      await action

      expect(resultsDom).to.equal(`<table>
<tr><td>some result</td></tr>
</table>`)

      expect(filterWatcher).to.have.callCount(4) // mark for update, updating, results, not updating
      expect(resultWatcher).to.have.callCount(9)
    })
  })
}

describe('lib', () => AllTests(ContextureClient))
describe('mobx', () => AllTests(ContextureMobx))
