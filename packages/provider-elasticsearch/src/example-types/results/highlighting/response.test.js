import _ from 'lodash/fp.js'
import { schema } from './testSchema.js'
import { describe, it, expect } from 'vitest'
import {
  mergeHighlightsOnSource,
  removePathsFromSource,
  getResponseHighlight,
  groupByArrayOfObjectsFields,
  getArrayOfScalarsFragments,
  getArrayOfObjectsFragments,
} from './response.js'

let tags = { pre: '<em>', post: '</em>' }

describe('groupByArrayOfObjectsFields', () => {
  it('should group array of objects fields but not array of scalars field', () => {
    let highlight = {
      'library.categories': [
        'Alternative <em>Medicine</em>',
        '<em>Ethnic</em> & Cultural',
      ],
      'library.books.cover.title': [
        'Nineteen <em>Eighty-Four</em>',
        '<em>The</em> Great Gatsby',
      ],
      'library.books.cover.author': [
        '<em>George</em> Orwell',
        'James <em>Joyce</em>',
      ],
    }
    let arrayOfObjectsPaths = ['library.books']
    expect(groupByArrayOfObjectsFields(arrayOfObjectsPaths, highlight)).toEqual(
      {
        'library.categories': [
          'Alternative <em>Medicine</em>',
          '<em>Ethnic</em> & Cultural',
        ],
        'library.books': {
          'cover.title': [
            'Nineteen <em>Eighty-Four</em>',
            '<em>The</em> Great Gatsby',
          ],
          'cover.author': ['<em>George</em> Orwell', 'James <em>Joyce</em>'],
        },
      }
    )
  })
})

describe('getIndexedAndMergedFragments', () => {
  it('should index and merge arrays of strings fragments', () => {
    let source = [
      'Ethnic & Cultural',
      'Computer Science',
      'Alternative Medicine',
    ]
    let fragments = [
      'Alternative <em>Medicine</em>',
      '<em>Ethnic</em> & Cultural',
      '<em>Alternative</em> Medicine',
      'Ethnic & <em>Cultural</em>',
    ]
    expect(getArrayOfScalarsFragments(tags, source, fragments)).toEqual({
      0: '<em>Ethnic</em> & <em>Cultural</em>',
      2: '<em>Alternative</em> <em>Medicine</em>',
    })
  })

  it('should index and merge arrays of objects fragments', () => {
    let source = [
      { cover: { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' } },
      { cover: { title: 'The Grapes of Wrath', author: 'John Steinbeck' } },
      { cover: { title: 'Nineteen Eighty-Four', author: 'George Orwell' } },
      { cover: { title: 'Ulysses', author: 'James Joyce' } },
    ]
    let fragments = [
      'Nineteen <em>Eighty-Four</em>',
      '<em>The</em> Great Gatsby',
      '<em>Nineteen</em> Eighty-Four',
      'The Great <em>Gatsby</em>',
    ]
    expect(
      getArrayOfScalarsFragments(tags, source, fragments, 'cover.title')
    ).toEqual({
      0: '<em>The</em> Great <em>Gatsby</em>',
      2: '<em>Nineteen</em> <em>Eighty-Four</em>',
    })
  })
})

describe('getArrayOfObjectsFragments()', () => {
  it('should return indexed and merged fragments', () => {
    let source = [
      { cover: { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' } },
      { cover: { title: 'The Grapes of Wrath', author: 'John Steinbeck' } },
      { cover: { title: 'Nineteen Eighty-Four', author: 'George Orwell' } },
      { cover: { title: 'Ulysses', author: 'James Joyce' } },
    ]
    let fragments = {
      'cover.title': [
        'Nineteen <em>Eighty-Four</em>',
        '<em>The</em> Great Gatsby',
      ],
      'cover.author': ['<em>George</em> Orwell', 'James <em>Joyce</em>'],
    }
    expect(getArrayOfObjectsFragments(tags, source, fragments)).toEqual({
      0: {
        cover: { title: '<em>The</em> Great Gatsby' },
      },
      2: {
        cover: {
          title: 'Nineteen <em>Eighty-Four</em>',
          author: '<em>George</em> Orwell',
        },
      },
      3: {
        cover: { author: 'James <em>Joyce</em>' },
      },
    })
  })
})

describe('getResponseHighlight()', () => {
  describe('text fields', () => {
    it('should merge fragments', () => {
      let hit = {
        highlight: {
          'library.name': [
            '<em>Imperial</em> College <em>London Abdus</em> Salam Library',
          ],
          'library.name.subfield': [
            'Imperial College London <em>Abdus Salam</em> Library',
          ],
        },
      }
      expect(getResponseHighlight(schema, hit, tags)).toEqual({
        'library.name':
          '<em>Imperial</em> College <em>London Abdus Salam</em> Library',
      })
    })
  })

  describe('blob text fields', () => {
    it('should not merge fragments', () => {
      let hit = {
        highlight: {
          'library.about': [
            'The <em>Abdus Salam Library</em> is',
            'is the <em>largest</em> of',
          ],
          'library.about.subfield': [
            'went on to <em>form part</em> of',
            'used <em>extensively</em> by members of the college',
          ],
        },
      }
      expect(getResponseHighlight(schema, hit, tags)).toEqual({
        'library.about': [
          'The <em>Abdus Salam Library</em> is',
          'is the <em>largest</em> of',
          'went on to <em>form part</em> of',
          'used <em>extensively</em> by members of the college',
        ],
      })
    })
  })

  describe('arrays of strings', () => {
    it('should resolve highlights indexes and merge fragments', () => {
      let hit = {
        _source: {
          library: {
            categories: [
              'Ethnic & Cultural',
              'Computer Science',
              'Alternative Medicine',
            ],
          },
        },
        highlight: {
          'library.categories': [
            'Alternative <em>Medicine</em>',
            '<em>Ethnic</em> & Cultural',
          ],
          'library.categories.subfield': [
            'Ethnic & <em>Cultural</em>',
            '<em>Alternative</em> Medicine',
          ],
        },
      }
      expect(getResponseHighlight(schema, hit, tags)).toEqual({
        'library.categories': {
          0: '<em>Ethnic</em> & <em>Cultural</em>',
          2: '<em>Alternative</em> <em>Medicine</em>',
        },
      })
    })
  })

  describe('arrays of objects', () => {
    it('should resolve highlights indexes and merge fragments', () => {
      let hit = {
        _source: {
          library: {
            // prettier-ignore
            books: [
              { cover: { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' } },
              { cover: { title: 'The Grapes of Wrath', author: 'John Steinbeck' } },
              { cover: { title: 'Nineteen Eighty-Four', author: 'George Orwell' } },
              { cover: { title: 'Ulysses', author: 'James Joyce' } },
            ],
          },
        },
        highlight: {
          'library.books.cover.title': [
            'Nineteen <em>Eighty-Four</em>',
            '<em>The</em> Great Gatsby',
          ],
          'library.books.cover.title.subfield': [
            '<em>Nineteen</em> Eighty-Four',
            'The Great <em>Gatsby</em>',
          ],
          'library.books.cover.author': [
            '<em>George</em> Orwell',
            'James <em>Joyce</em>',
          ],
          'library.books.cover.author.subfield': [
            'George <em>Orwell</em>',
            '<em>James</em> Joyce',
          ],
        },
      }
      expect(getResponseHighlight(schema, hit, tags)).toEqual({
        'library.books': {
          0: {
            cover: {
              title: '<em>The</em> Great <em>Gatsby</em>',
            },
          },
          2: {
            cover: {
              title: '<em>Nineteen</em> <em>Eighty-Four</em>',
              author: '<em>George</em> <em>Orwell</em>',
            },
          },
          3: {
            cover: {
              author: '<em>James</em> <em>Joyce</em>',
            },
          },
        },
      })
    })

    it('should copy source fields', () => {
      let hit = {
        _source: {
          library: {
            // prettier-ignore
            books: [
              { cover: { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' } },
              { cover: { title: 'The Grapes of Wrath', author: 'John Steinbeck' } },
              { cover: { title: 'Nineteen Eighty-Four', author: 'George Orwell' } },
              { cover: { title: 'Ulysses', author: 'James Joyce' } },
            ],
          },
        },
        highlight: {
          'library.books.cover.title': [
            'Nineteen <em>Eighty-Four</em>',
            '<em>The</em> Great Gatsby',
          ],
        },
      }
      let nestedPathsMap = { 'library.books': ['cover.author'] }
      expect(getResponseHighlight(schema, hit, tags, nestedPathsMap)).toEqual({
        'library.books': {
          0: {
            cover: {
              title: '<em>The</em> Great Gatsby',
              author: 'F. Scott Fitzgerald',
            },
          },
          2: {
            cover: {
              title: 'Nineteen <em>Eighty-Four</em>',
              author: 'George Orwell',
            },
          },
        },
      })
    })

    it('should not overwrite highlights when copying source fields', () => {
      let hit = {
        _source: {
          library: {
            // prettier-ignore
            books: [
              { cover: { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' } },
              { cover: { title: 'The Grapes of Wrath', author: 'John Steinbeck' } },
              { cover: { title: 'Nineteen Eighty-Four', author: 'George Orwell' } },
              { cover: { title: 'Ulysses', author: 'James Joyce' } },
            ],
          },
        },
        highlight: {
          'library.books.cover.title': [
            'Nineteen <em>Eighty-Four</em>',
            '<em>The</em> Great Gatsby',
          ],
          'library.books.cover.author': [
            '<em>George</em> Orwell',
            'James <em>Joyce</em>',
          ],
        },
      }
      let nestedPathsMap = { 'library.books': ['cover.title'] }
      expect(getResponseHighlight(schema, hit, tags, nestedPathsMap)).toEqual({
        'library.books': {
          0: {
            cover: {
              title: '<em>The</em> Great Gatsby',
            },
          },
          2: {
            cover: {
              title: 'Nineteen <em>Eighty-Four</em>',
              author: '<em>George</em> Orwell',
            },
          },
          3: {
            cover: {
              title: 'Ulysses',
              author: 'James <em>Joyce</em>',
            },
          },
        },
      })
    })
  })
})

describe('removePathsFromSource()', () => {
  let hit = {
    _source: {
      library: {
        categories: [
          'Ethnic & Cultural',
          'Computer Science',
          'Alternative Medicine',
        ],
        books: [
          { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
          { title: 'The Grapes of Wrath', author: 'John Steinbeck' },
          { title: 'Nineteen Eighty-Four', author: 'George Orwell' },
          { title: 'Ulysses', author: 'James Joyce' },
        ],
      },
    },
  }

  it('should not remove fields from source if additional includes is empty', () => {
    let cloned = _.cloneDeep(hit)
    removePathsFromSource(schema, cloned)
    expect(cloned).toEqual(hit)
  })

  it('should remove array of scalars', () => {
    let cloned = _.cloneDeep(hit)
    removePathsFromSource(schema, cloned, ['library.categories'])
    expect(cloned).toEqual({
      _source: {
        library: {
          books: [
            { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
            { title: 'The Grapes of Wrath', author: 'John Steinbeck' },
            { title: 'Nineteen Eighty-Four', author: 'George Orwell' },
            { title: 'Ulysses', author: 'James Joyce' },
          ],
        },
      },
    })
  })

  it('should remove array of objects', () => {
    let cloned = _.cloneDeep(hit)
    removePathsFromSource(schema, cloned, ['library.books'])
    expect(cloned).toEqual({
      _source: {
        library: {
          categories: [
            'Ethnic & Cultural',
            'Computer Science',
            'Alternative Medicine',
          ],
        },
      },
    })
  })

  it('should remove nested field in array of objects', () => {
    let cloned = _.cloneDeep(hit)
    removePathsFromSource(schema, cloned, ['library.books.author'])
    expect(cloned).toEqual({
      _source: {
        library: {
          categories: [
            'Ethnic & Cultural',
            'Computer Science',
            'Alternative Medicine',
          ],
          books: [
            { title: 'The Great Gatsby' },
            { title: 'The Grapes of Wrath' },
            { title: 'Nineteen Eighty-Four' },
            { title: 'Ulysses' },
          ],
        },
      },
    })
  })

  it('should remove array of objects when all its nested fields are removed', () => {
    let cloned = _.cloneDeep(hit)
    removePathsFromSource(schema, cloned, [
      'library.books.title',
      'library.books.author',
    ])
    expect(cloned).toEqual({
      _source: {
        library: {
          categories: [
            'Ethnic & Cultural',
            'Computer Science',
            'Alternative Medicine',
          ],
        },
      },
    })
  })
})

describe('mergeHighlightsOnSource()', () => {
  it('should merge onto source', () => {
    let hit = {
      _source: {
        library: {
          name: 'Imperial College London Abdus Salam Library',
        },
      },
      highlight: {
        'library.name':
          '<em>Imperial</em> College <em>London Abdus</em> Salam Library',
        'library.about': [
          'The <em>Abdus Salam Library</em> is',
          'is the <em>largest</em> of',
        ],
      },
    }
    mergeHighlightsOnSource(schema, hit)
    expect(hit).toEqual({
      _source: {
        library: {
          name: '<em>Imperial</em> College <em>London Abdus</em> Salam Library',
          about: [
            'The <em>Abdus Salam Library</em> is',
            'is the <em>largest</em> of',
          ],
        },
      },
      highlight: {
        'library.name':
          '<em>Imperial</em> College <em>London Abdus</em> Salam Library',
        'library.about': [
          'The <em>Abdus Salam Library</em> is',
          'is the <em>largest</em> of',
        ],
      },
    })
  })

  describe('arrays of strings', () => {
    it('should merge onto source', () => {
      let hit = {
        _source: {
          library: {
            categories: [
              'Ethnic & Cultural',
              'Computer Science',
              'Alternative Medicine',
            ],
          },
        },
        highlight: {
          'library.categories': {
            0: '<em>Ethnic</em> & <em>Cultural</em>',
            2: '<em>Alternative</em> <em>Medicine</em>',
          },
        },
      }
      mergeHighlightsOnSource(schema, hit)
      expect(hit).toEqual({
        _source: {
          library: {
            categories: [
              '<em>Ethnic</em> & <em>Cultural</em>',
              'Computer Science',
              '<em>Alternative</em> <em>Medicine</em>',
            ],
          },
        },
        highlight: {
          'library.categories': [
            '<em>Ethnic</em> & <em>Cultural</em>',
            '<em>Alternative</em> <em>Medicine</em>',
          ],
        },
      })
    })

    it('should merge onto source when source array is missing', () => {
      let hit = {
        _source: {},
        highlight: {
          'library.categories': {
            0: '<em>Ethnic</em> & <em>Cultural</em>',
            2: '<em>Alternative</em> <em>Medicine</em>',
          },
        },
      }
      mergeHighlightsOnSource(schema, hit)
      expect(hit).toEqual({
        _source: {
          library: {
            categories: [
              '<em>Ethnic</em> & <em>Cultural</em>',
              '<em>Alternative</em> <em>Medicine</em>',
            ],
          },
        },
        highlight: {
          'library.categories': [
            '<em>Ethnic</em> & <em>Cultural</em>',
            '<em>Alternative</em> <em>Medicine</em>',
          ],
        },
      })
    })
  })

  describe('arrays of objects', () => {
    it('should merge onto source', () => {
      let hit = {
        _source: {
          library: {
            // prettier-ignore
            books: [
              { cover: { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' } },
              { cover: { title: 'The Grapes of Wrath', author: 'John Steinbeck' } },
              { cover: { title: 'Nineteen Eighty-Four', author: 'George Orwell' } },
              { cover: { title: 'Ulysses', author: 'James Joyce' } },
            ],
          },
        },
        highlight: {
          'library.books': {
            0: {
              cover: {
                title: '<em>The</em> Great <em>Gatsby</em>',
              },
            },
            2: {
              cover: {
                title: '<em>Nineteen</em> <em>Eighty-Four</em>',
                author: '<em>George</em> <em>Orwell</em>',
              },
            },
            3: {
              cover: {
                author: '<em>James</em> <em>Joyce</em>',
              },
            },
          },
        },
      }
      mergeHighlightsOnSource(schema, hit)
      expect(hit).toEqual({
        _source: {
          library: {
            books: [
              {
                cover: {
                  title: '<em>The</em> Great <em>Gatsby</em>',
                  author: 'F. Scott Fitzgerald',
                },
              },
              {
                cover: {
                  title: 'The Grapes of Wrath',
                  author: 'John Steinbeck',
                },
              },
              {
                cover: {
                  title: '<em>Nineteen</em> <em>Eighty-Four</em>',
                  author: '<em>George</em> <em>Orwell</em>',
                },
              },
              {
                cover: {
                  title: 'Ulysses',
                  author: '<em>James</em> <em>Joyce</em>',
                },
              },
            ],
          },
        },
        highlight: {
          'library.books': [
            {
              cover: {
                title: '<em>The</em> Great <em>Gatsby</em>',
              },
            },
            {
              cover: {
                title: '<em>Nineteen</em> <em>Eighty-Four</em>',
                author: '<em>George</em> <em>Orwell</em>',
              },
            },
            {
              cover: {
                author: '<em>James</em> <em>Joyce</em>',
              },
            },
          ],
        },
      })
    })

    it('should merge onto source when source array is missing', () => {
      let hit = {
        _source: {},
        highlight: {
          'library.books': {
            0: {
              cover: {
                title: '<em>The</em> Great <em>Gatsby</em>',
              },
            },
            2: {
              cover: {
                title: '<em>Nineteen</em> <em>Eighty-Four</em>',
                author: '<em>George</em> <em>Orwell</em>',
              },
            },
            3: {
              cover: {
                author: '<em>James</em> <em>Joyce</em>',
              },
            },
          },
        },
      }
      mergeHighlightsOnSource(schema, hit)
      expect(hit).toEqual({
        _source: {
          library: {
            books: [
              {
                cover: {
                  title: '<em>The</em> Great <em>Gatsby</em>',
                },
              },
              {
                cover: {
                  title: '<em>Nineteen</em> <em>Eighty-Four</em>',
                  author: '<em>George</em> <em>Orwell</em>',
                },
              },
              {
                cover: {
                  author: '<em>James</em> <em>Joyce</em>',
                },
              },
            ],
          },
        },
        highlight: {
          'library.books': [
            {
              cover: {
                title: '<em>The</em> Great <em>Gatsby</em>',
              },
            },
            {
              cover: {
                title: '<em>Nineteen</em> <em>Eighty-Four</em>',
                author: '<em>George</em> <em>Orwell</em>',
              },
            },
            {
              cover: {
                author: '<em>James</em> <em>Joyce</em>',
              },
            },
          ],
        },
      })
    })
  })
})
