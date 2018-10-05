let highlighting = require('../src/highlighting')
let { expect } = require('chai')

describe('highlighting', () => {
  describe('highlightResults', () => {
    it('should work with includes', () => {
      let highlightFields = { inline: [ 'title', 'description', 'summary' ] }
      let hit = {
        _source: { summary: 'Chromebooks',
          dueDate: '2018-10-11',
          agencyID: 77985,
          agencyStateCode: 'TX',
          title: 'Chromebooks',
          bidNumber: '8934908',
          agencyName: 'Mission Consolidated Independent School Dist. 908'
        },
        highlight: { summary: ['a'], description: ['b'], title: ['c'] }
      }
      let include = [ 'title' ]
      let result = highlighting.highlightResults(highlightFields, hit, undefined, include)
      expect(result).to.deep.equal({
        additionalFields: [{
          label: 'summary',
          value: 'a',
        }, {
          label: 'description',
          value: 'b',
        }],
        mainHighlighted: true,
      })
    })
    it('should work without includes', () => {
      let highlightFields = { inline: [ 'title', 'description', 'summary' ] }
      let hit = {
        _source: { summary: 'Chromebooks',
          dueDate: '2018-10-11',
          agencyID: 77985,
          agencyStateCode: 'TX',
          title: 'Chromebooks',
          bidNumber: '8934908',
          agencyName: 'Mission Consolidated Independent School Dist. 908'
        },
        highlight: { summary: ['a'], description: ['b'], title: ['c'] }
      }
      let result = highlighting.highlightResults(highlightFields, hit)
      expect(result).to.deep.equal({
        additionalFields: [],
        mainHighlighted: true,
      })
    })
  })
})
