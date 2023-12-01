import { schema } from './schema.test.js'
import { mergeHighlightsOnSource } from './merging.js'

describe('mergeHighlightsOnSource()', () => {
  it('should merge onto source', () => {
    const hit = {
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
      const hit = {
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
      const hit = {
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
      const hit = {
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
      const hit = {
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
