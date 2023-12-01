import _ from 'lodash/fp.js'
import { schema } from './schema.test.js'
import { addPathsToSource, removePathsFromSource } from './search.js'

describe('addPathsToSource()', () => {
  describe('paths with no wildcards', () => {
    it('should not add path when source is empty', () => {
      const body = {}
      const added = addPathsToSource(schema, body, ['library.name'])
      expect(body).toEqual({})
      expect(added).toEqual()
    })

    it('should not add path when there are no paths to add', () => {
      const body = {
        _source: {
          includes: ['library.name'],
          excludes: ['library.about'],
        },
      }
      const added = addPathsToSource(schema, body)
      expect(body).toEqual({
        _source: {
          includes: ['library.name'],
          excludes: ['library.about'],
        },
      })
      expect(added).toEqual()
    })

    it('should not add path when includes is empty and path is not excluded', () => {
      const body = {
        _source: {
          excludes: ['library.about'],
        },
      }
      const added = addPathsToSource(schema, body, ['library.name'])
      expect(body).toEqual({
        _source: {
          excludes: ['library.about'],
        },
      })
      expect(added).toEqual()
    })

    it('should add path when includes is empty and path is excluded', () => {
      const body = {
        _source: {
          excludes: ['library.name'],
        },
      }
      const added = addPathsToSource(schema, body, ['library.name'])
      expect(body).toEqual({
        _source: {},
      })
      expect(added).toEqual(['library.name'])
    })

    it('should add path when includes is not empty and path is not excluded', () => {
      const body = {
        _source: {
          includes: ['library.categories'],
          excludes: ['library.about'],
        },
      }
      const added = addPathsToSource(schema, body, ['library.name'])
      expect(body).toEqual({
        _source: {
          includes: ['library.categories', 'library.name'],
          excludes: ['library.about'],
        },
      })
      expect(added).toEqual(['library.name'])
    })

    it('should add path when includes is not empty and path is excluded', () => {
      const body = {
        _source: {
          includes: ['library.categories'],
          excludes: ['library.name'],
        },
      }
      const added = addPathsToSource(schema, body, ['library.name'])
      expect(body).toEqual({
        _source: {
          includes: ['library.categories', 'library.name'],
        },
      })
      expect(added).toEqual(['library.name'])
    })

    it('should add path in array of objects and adjust excludes accordingly', () => {
      const body = {
        _source: {
          includes: ['library.about'],
          excludes: ['library.books'],
        },
      }
      const added = addPathsToSource(schema, body, [
        'library.books.cover.title',
      ])
      expect(body).toEqual({
        _source: {
          includes: ['library.about', 'library.books.cover.title'],
          excludes: ['library.books.cover.author'],
        },
      })
      expect(added).toEqual(['library.books.cover.title'])
    })
  })

  describe('paths with wildcards', () => {
    it('should not add path when includes is empty and path is not excluded', () => {
      const body = {
        _source: {
          excludes: ['library.books.*'],
        },
      }
      const added = addPathsToSource(schema, body, ['library.name'])
      expect(body).toEqual({
        _source: {
          excludes: ['library.books.*'],
        },
      })
      expect(added).toEqual()
    })

    it('should add path when includes is empty and path is excluded', () => {
      const body = {
        _source: {
          excludes: ['library.*'],
        },
      }
      const added = addPathsToSource(schema, body, ['library.about'])
      expect(body).toEqual({
        _source: {
          excludes: [
            'library.name',
            'library.categories',
            'library.books.cover.title',
            'library.books.cover.author',
          ],
        },
      })
      expect(added).toEqual(['library.about'])
    })

    it('should add path when includes is not empty and path is not excluded', () => {
      const body = {
        _source: {
          includes: ['library.about'],
          excludes: ['library.books.*'],
        },
      }
      const added = addPathsToSource(schema, body, ['library.name'])
      expect(body).toEqual({
        _source: {
          includes: ['library.about', 'library.name'],
          excludes: ['library.books.*'],
        },
      })
      expect(added).toEqual(['library.name'])
    })

    it('should add path when includes is not empty and path is excluded', () => {
      const body = {
        _source: {
          includes: ['library.*'],
          excludes: ['library.books.*'],
        },
      }
      const added = addPathsToSource(schema, body, [
        'library.books.cover.title',
      ])
      expect(body).toEqual({
        _source: {
          includes: ['library.*'],
          excludes: ['library.books.cover.author'],
        },
      })
      expect(added).toEqual(['library.books.cover.title'])
    })

    it('should not expand includes when adding to it', () => {
      const body = {
        _source: {
          includes: ['library.books.*'],
          excludes: ['library.name'],
        },
      }
      const added = addPathsToSource(schema, body, ['library.name'])
      expect(body).toEqual({
        _source: {
          includes: ['library.books.*', 'library.name'],
        },
      })
      expect(added).toEqual(['library.name'])
    })
  })
})

describe('removePathsFromSource()', () => {
  const hit = {
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
    const cloned = _.cloneDeep(hit)
    removePathsFromSource(schema, cloned)
    expect(cloned).toEqual(hit)
  })

  it('should remove array of scalars', () => {
    const cloned = _.cloneDeep(hit)
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
    const cloned = _.cloneDeep(hit)
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
    const cloned = _.cloneDeep(hit)
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
    const cloned = _.cloneDeep(hit)
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
