import {
  highlightResults,
  arrayToHighlightsFieldMap,
  anyRegexesMatch,
  replaceHighlightTagRegex,
  containsHighlightTagRegex,
  combineMultiFields,
  mergeHitHighlights,
} from './highlighting.js'

let nodeHighlight = {
  pre_tags: ['<b class="search-highlight">'],
  post_tags: ['</b>'],
}

describe('highlighting', () => {
  describe('highlightResults', () => {
    it('should work with includes', () => {
      let schemaHighlight = { inline: ['title', 'description', 'summary'] }
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
      let result = highlightResults({
        schemaHighlight,
        nodeHighlight,
        hit,
        include,
      })
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
      let schemaHighlight = { inline: ['title', 'description', 'summary'] }
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
      let result = highlightResults({ schemaHighlight, nodeHighlight, hit })
      expect(result).toEqual({
        additionalFields: [],
      })
    })
    it('should work with inline', () => {
      let schemaHighlight = {
        inline: ['title', 'description'],
      }
      let hit = {
        _source: {
          title: '...',
          description: '...',
        },
        highlight: { title: ['<a>foo</a>'], description: ['<a>bar</a>'] },
      }
      let result = highlightResults({ schemaHighlight, nodeHighlight, hit })
      expect(hit._source).toEqual({
        title: '<a>foo</a>',
        description: '<a>bar</a>',
      })
      expect(result).toEqual({
        additionalFields: [],
      })
    })
    it('should work with inline and .* object', () => {
      let schemaHighlight = {
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
      let result = highlightResults({ schemaHighlight, nodeHighlight, hit })
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
      let schemaHighlight = {
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
      let result = highlightResults({ schemaHighlight, nodeHighlight, hit })
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
      let schemaHighlight = {
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
      let result = highlightResults({ schemaHighlight, nodeHighlight, hit })
      expect(hit._source).toEqual({
        title: '<a>foo</a>',
        description: '<a>bar</a>',
      })
      expect(result).toEqual({
        additionalFields: [],
      })
    })
    it('inline should precede inlineAliases', () => {
      let schemaHighlight = {
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
      let result = highlightResults({ schemaHighlight, nodeHighlight, hit })
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
      let schemaHighlight = {
        nested: ['comments.text'],
        nestedPath: 'comments',
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
      let result = highlightResults({
        schemaHighlight,
        nodeHighlight,
        hit,
        include: ['title', 'description', 'comments.text'],
      })
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
      let schemaHighlight = {
        nested: ['comments.text'],
        nestedPath: 'comments',
        filterNested: true,
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
      let result = highlightResults({
        schemaHighlight,
        nodeHighlight,
        hit,
        include: ['title', 'description', 'comments.text'],
      })
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
      let schemaHighlight = {
        nested: ['comments.text'],
        nestedPath: 'comments',
        filterNested: true,
      }
      let hit = {
        _source: {
          title: '...',
          description: '...',
          comments: [{ text: 'foo' }, { text: 'bar' }, { text: 'baz' }],
        },
        highlight: {},
      }
      let result = highlightResults({
        schemaHighlight,
        nodeHighlight,
        hit,
        include: ['title', 'description', 'comments.text'],
      })
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

describe('replaceHighlightTagRegex()', () => {
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

describe('containsHighlightTagRegex()', () => {
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

describe('Highlight field aggregation', () => {
  it('should combine all fields with subField definitions', () => {
    let fields = { title: {}, description: {}, documents: {} }
    let subFields = [
      { name: 'exact', shouldHighlight: true },
      { name: 'keyword', shouldHighlight: false },
    ]

    expect(combineMultiFields(fields, subFields)).toEqual({
      description: {},
      'description.exact': {},
      title: {},
      'title.exact': {},
      documents: {},
      'documents.exact': {},
    })
  })
  it('should combine subfield highlights with field highlights', () => {
    let hitHighlights = { 
      'foo.bar': ['<b class="search-highlight">foo</b> this handle'],
      'foo.bar.exact': ['foo this <b class="search-highlight">handle</b>'],
      'foo': ['foo this <b class="search-highlight">bar</b>'],
      'foo.exact': ['<b class="search-highlight">foo</b> this bar'],
      'foo.car.bar': ['<b class="search-highlight">foo</b> this is not merged'],
    }
    let node = { 
      highlight: { 
        fields : {
          'foo.bar': {},
          'foo': {},
          'foo.car.bar': {},
        }
      }
    }

    let nodeHighlight = {
      pre_tags: ['<b class="search-highlight">'],
      post_tags:['</b>'],
    }

    expect(mergeHitHighlights(nodeHighlight, node, hitHighlights)).toEqual(
      { 'foo.bar': ['<b class="search-highlight">foo</b> this <b class="search-highlight">handle</b>'],
        'foo': ['<b class="search-highlight">foo</b> this <b class="search-highlight">bar</b>'],
        'foo.car.bar': ['<b class="search-highlight">foo</b> this is not merged'],
      }
    )
  })
})
