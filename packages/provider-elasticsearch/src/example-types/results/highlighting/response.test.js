import { schema } from './schema.test.js'
import { transformResponseHighlight } from './response.js'

const tags = { pre: '<em>', post: '</em>' }

describe('transformResponseHighlight()', () => {
  describe('text fields', () => {
    it('should merge fragments', () => {
      const hit = {
        highlight: {
          'library.name': [
            '<em>Imperial</em> College <em>London Abdus</em> Salam Library',
          ],
          'library.name.subfield': [
            'Imperial College London <em>Abdus Salam</em> Library',
          ],
        },
      }
      transformResponseHighlight(schema, hit, tags)
      expect(hit.highlight).toEqual({
        'library.name':
          '<em>Imperial</em> College <em>London Abdus Salam</em> Library',
      })
    })
  })

  describe('blob text fields', () => {
    it('should not merge fragments', () => {
      const hit = {
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
      transformResponseHighlight(schema, hit, tags)
      expect(hit.highlight).toEqual({
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
      transformResponseHighlight(schema, hit, tags)
      expect(hit.highlight).toEqual({
        'library.categories': {
          0: '<em>Ethnic</em> & <em>Cultural</em>',
          2: '<em>Alternative</em> <em>Medicine</em>',
        },
      })
    })
  })

  describe('arrays of objects', () => {
    it('should resolve highlights indexes and merge fragments', () => {
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
      transformResponseHighlight(schema, hit, tags)
      expect(hit.highlight).toEqual({
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
          'library.books.cover.title': [
            'Nineteen <em>Eighty-Four</em>',
            '<em>The</em> Great Gatsby',
          ],
        },
      }
      const arrayIncludes = { 'library.books': ['cover.author'] }
      transformResponseHighlight(schema, hit, tags, arrayIncludes)
      expect(hit.highlight).toEqual({
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
      const arrayIncludes = { 'library.books': ['cover.title'] }
      transformResponseHighlight(schema, hit, tags, arrayIncludes)
      expect(hit.highlight).toEqual({
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
