import {
  highlightResults,
  arrayToHighlightsFieldMap,
  anyRegexesMatch,
  replaceHighlightTagRegex,
  containsHighlightTagRegex,
} from './highlighting.js'

describe('highlighting', () => {
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
      let result = highlightResults(highlightFields, hit, undefined, include)
      expect(result).toEqual({
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
      let result = highlightResults(highlightFields, hit)
      expect(result).toEqual({
        additionalFields: [],
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
      let result = highlightResults(highlightFields, hit)
      expect(hit._source).toEqual({
        title: '<a>foo</a>',
        description: '<a>bar</a>',
      })
      expect(result).toEqual({
        additionalFields: [],
      })
    })
    it('should work with inline and .* object', () => {
      let highlightFields = {
        inline: [
          'title',
          'description',
          {
            'documents.*': {
              file0: {
                number_of_fragments: 1,
              },
            },
          },
        ],
      }
      let hit = {
        _source: {
          title: '...',
          description: '...',
        },
        highlight: {
          title: ['<a>foo</a>'],
          description: ['<a>bar</a>'],
          'documents.file0.parseBoxText': ['<a>fooBar</a>'],
        },
      }
      let result = highlightResults(highlightFields, hit)
      expect(hit._source).toEqual({
        title: '<a>foo</a>',
        description: '<a>bar</a>',
        documents: {
          file0: {
            parseBoxText: ['<a>fooBar</a>'],
          },
        },
      })
      expect(result).toEqual({
        additionalFields: [],
      })
    })
    it('should work with inline and object', () => {
      let highlightFields = {
        inline: [
          'title',
          'description',
          {
            documents: {
              number_of_fragments: 1,
            },
          },
        ],
      }
      let hit = {
        _source: {
          title: '...',
          description: '...',
        },
        highlight: {
          title: ['<a>foo</a>'],
          description: ['<a>bar</a>'],
          documents: ['<a>fooBar</a>'],
        },
      }
      let result = highlightResults(highlightFields, hit)
      expect(hit._source).toEqual({
        title: '<a>foo</a>',
        description: '<a>bar</a>',
        documents: '<a>fooBar</a>',
      })
      expect(result).toEqual({
        additionalFields: [],
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
      let result = highlightResults(highlightFields, hit)
      expect(hit._source).toEqual({
        title: '<a>foo</a>',
        description: '<a>bar</a>',
      })
      expect(result).toEqual({
        additionalFields: [],
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
      let result = highlightResults(highlightFields, hit)
      expect(hit._source).toEqual({
        description: '<a>foo</a>',
      })
      expect(result).toEqual({
        additionalFields: [],
      })
    })
    it('arrayToHighlightsFieldMap should work', () => {
      let inline = [
        'title',
        'description',
        {
          documents: {
            number_of_fragments: 1,
          },
        },
      ]
      let result = arrayToHighlightsFieldMap(inline)
      expect(result).toEqual({
        title: {},
        description: {},
        documents: {
          number_of_fragments: 1,
        },
      })
    })
    it('should work with nested', () => {
      let highlightFields = {
        nested: ['comments.text'],
      }
      let hit = {
        _source: {
          title: '...',
          description: '...',
          comments: [{ text: 'foo' }, { text: 'bar' }, { text: 'baz' }],
        },
        highlight: {
          'comments.text': [
            '<b class="search-highlight">foo</b>',
            '<b class="search-highlight">bar</b>',
          ],
        },
      }
      let result = highlightResults(highlightFields, hit, 'comments', [
        'title',
        'description',
        'comments.text',
      ])
      expect(hit._source).toEqual({
        title: '...',
        description: '...',
        comments: [
          { text: '<b class="search-highlight">foo</b>' },
          { text: '<b class="search-highlight">bar</b>' },
          { text: 'baz' },
        ],
      })
      expect(result).toEqual({
        additionalFields: [],
      })
    })
    it('should work with nested and filterNested', () => {
      let highlightFields = {
        nested: ['comments.text'],
      }
      let hit = {
        _source: {
          title: '...',
          description: '...',
          comments: [{ text: 'foo' }, { text: 'bar' }, { text: 'baz' }],
        },
        highlight: {
          'comments.text': [
            '<b class="search-highlight">foo</b>',
            '<b class="search-highlight">bar</b>',
          ],
        },
      }
      let result = highlightResults(
        highlightFields,
        hit,
        'comments',
        ['title', 'description', 'comments.text'],
        true
      )
      expect(hit._source).toEqual({
        title: '...',
        description: '...',
        comments: [
          { text: '<b class="search-highlight">foo</b>' },
          { text: '<b class="search-highlight">bar</b>' },
        ],
      })
      expect(result).toEqual({
        additionalFields: [],
      })
    })

    it('should clear nested when filterNested and highlight is empty', () => {
      let highlightFields = {
        nested: ['comments.text'],
      }
      let hit = {
        _source: {
          title: '...',
          description: '...',
          comments: [{ text: 'foo' }, { text: 'bar' }, { text: 'baz' }],
        },
        highlight: {},
      }
      let result = highlightResults(
        highlightFields,
        hit,
        'comments',
        ['title', 'description', 'comments.text'],
        true
      )
      expect(hit._source).toEqual({
        title: '...',
        description: '...',
        comments: [],
      })
      expect(result).toEqual({
        additionalFields: [],
      })
    })
  })
})

describe('anyRegexesMatch()', () => {
  it('should match', () => {
    let actual = anyRegexesMatch(['non-matching', 'nested.*'], 'nested.field')
    expect(actual).toEqual(true)
  })

  it('should not match', () => {
    let actual = anyRegexesMatch(
      ['non-matching', 'non-matching.*'],
      'nested.field'
    )
    expect(actual).toEqual(false)
  })
})

describe.only('replaceHighlightTagRegex()', () => {
  it('should remove all tags from highlighted text', () => {
    let regex = replaceHighlightTagRegex({
      pre_tags: ['<em>', '<b class="hi-1">'],
      post_tags: ['</em>', '</b>'],
    })
    let text =
      'Lorem Ipsum <em>has</em> been the industry standard <em>dummy</em> text ever <b class="hi-1">since the 1500s</b>.'
    expect(text.replace(regex, '')).toEqual(
      'Lorem Ipsum has been the industry standard dummy text ever since the 1500s.'
    )
  })
})

describe.only('containsHighlightTagRegex()', () => {
  it('should match highlighted text', () => {
    let regex = containsHighlightTagRegex({
      pre_tags: ['<em>', '<b class="hi-1">'],
      post_tags: ['</em>', '</b>'],
    })
    let text =
      'Lorem Ipsum <em>has</em> been the industry standard <em>dummy</em> text ever <b class="hi-1">since the 1500s</b>.'
    expect(regex.test(text)).toEqual(true)
  })

  it('should not match non-highlighted text', () => {
    let regex = containsHighlightTagRegex({
      pre_tags: ['<em>', '<b class="hi-1">'],
      post_tags: ['</em>', '</b>'],
    })
    let text =
      'Lorem Ipsum has been the industry standard dummy text ever since the 1500s.'
    expect(regex.test(text)).toEqual(false)
  })

  it('should not match non-balanced tags', () => {
    let regex = containsHighlightTagRegex({
      pre_tags: ['<em>', '<b class="hi-1">'],
      post_tags: ['</em>', '</b>'],
    })
    let text =
      'Lorem Ipsum has been the <b class="hi-1">industry standard dummy text ever since the 1500s.'
    expect(regex.test(text)).toEqual(false)
  })
})
