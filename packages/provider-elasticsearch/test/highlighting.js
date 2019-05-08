let highlighting = require('../src/highlighting')
let { expect } = require('chai')

describe.only('highlighting', () => {
  describe('highlightResults', () => {
    it('should work with includes', () => {
      let highlightFields = { inline: ['title', 'description', 'summary'] }
      let hit = {
        _source: {
          summary: 'Chromebooks',
          dueDate: '2018-10-11',
          agencyID: 77985,
          agencyStateCode: 'TX',
          title: 'Chromebooks',
          bidNumber: '8934908',
          agencyName: 'Mission Consolidated Independent School Dist. 908',
        },
        highlight: { summary: ['a'], description: ['b'], title: ['c'] },
      }
      let include = ['title']
      let result = highlighting.highlightResults(
        highlightFields,
        hit,
        undefined,
        include
      )
      expect(result).to.deep.equal({
        additionalFields: [
          {
            label: 'summary',
            value: 'a',
          },
          {
            label: 'description',
            value: 'b',
          },
        ],
        mainHighlighted: true,
      })
    })
    it('should work without includes', () => {
      let highlightFields = { inline: ['title', 'description', 'summary'] }
      let hit = {
        _source: {
          summary: 'Chromebooks',
          dueDate: '2018-10-11',
          agencyID: 77985,
          agencyStateCode: 'TX',
          title: 'Chromebooks',
          bidNumber: '8934908',
          agencyName: 'Mission Consolidated Independent School Dist. 908',
        },
        highlight: { summary: ['a'], description: ['b'], title: ['c'] },
      }
      let result = highlighting.highlightResults(highlightFields, hit)
      expect(result).to.deep.equal({
        additionalFields: [],
        mainHighlighted: true,
      })
    })
    it('should work with inline', () => {
      let highlightFields = {
        inline: ['title', 'description'],
      }
      let hit = {
        _source: {
          title: '...',
          description: '...',
        },
        highlight: { title: ['<a>foo</a>'], description: ['<a>bar</a>'] },
      }
      let result = highlighting.highlightResults(highlightFields, hit)
      expect(hit._source).to.deep.equal({
        title: '<a>foo</a>',
        description: '<a>bar</a>',
      })
      expect(result).to.deep.equal({
        additionalFields: [],
        mainHighlighted: true,
      })
    })
    it('should work with inlineAliases', () => {
      let highlightFields = {
        inline: ['title', 'description'],
        inlineAliases: {
          description: 'description.exact',
        },
      }
      let hit = {
        _source: {
          title: '...',
          description: '...',
        },
        highlight: {
          title: ['<a>foo</a>'],
          'description.exact': ['<a>bar</a>'],
        },
      }
      let result = highlighting.highlightResults(highlightFields, hit)
      expect(hit._source).to.deep.equal({
        title: '<a>foo</a>',
        description: '<a>bar</a>',
      })
      expect(result).to.deep.equal({
        additionalFields: [],
        mainHighlighted: true,
      })
    })
    it('inline should precede inlineAliases', () => {
      let highlightFields = {
        inline: ['description'],
        inlineAliases: {
          description: 'description.exact',
        },
      }
      let hit = {
        _source: {
          description: '...',
        },
        highlight: {
          description: ['<a>foo</a>'],
          'description.exact': ['<a>bar</a>'],
        },
      }
      let result = highlighting.highlightResults(highlightFields, hit)
      expect(hit._source).to.deep.equal({
        description: '<a>foo</a>',
      })
      expect(result).to.deep.equal({
        additionalFields: [],
        mainHighlighted: true,
      })
    })
  })
})
