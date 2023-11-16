import { mergeHighlightsOnSource } from './merging.js'

describe('mergeHighlightsOnSource()', () => {
  const schema = {
    fields: {
      segments: {
        elasticsearch: { meta: { subType: 'array' } },
      },
    },
  }

  it('should merge highlights', () => {
    const source = {
      state: 'California',
      city: 'San Francisco',
      book: {
        title: 'Don Quixote',
        blob: 'The quick brown fox jumped over the lazy dog',
        authors: ['John Snow', 'Neo'],
      },
    }
    const highlights = {
      city: '<em>San</em> Francisco',
      book: {
        blob: ['<em>The</em> quick', 'jumped <em>over</em>'],
      },
    }
    mergeHighlightsOnSource(schema, {}, source, highlights)
    expect(source).toEqual({
      state: 'California',
      city: '<em>San</em> Francisco',
      book: {
        title: 'Don Quixote',
        blob: ['<em>The</em> quick', 'jumped <em>over</em>'],
        authors: ['John Snow', 'Neo'],
      },
    })
  })

  it('should not clear source array when highlight result is missing field', () => {
    const source = {
      segments: ['The quick', 'brown fox', 'jumped over', 'the lazy dog'],
    }
    const highlights = {}
    mergeHighlightsOnSource(schema, {}, source, highlights)
    expect(source).toEqual({
      segments: ['The quick', 'brown fox', 'jumped over', 'the lazy dog'],
    })
  })

  it('should merge highlights on array of strings when source has value', () => {
    const source = {
      segments: ['The quick', 'brown fox', 'jumped over', 'the lazy dog'],
    }
    const highlights = {
      segments: [
        '<em>The</em> quick',
        undefined,
        'jumped <em>over</em>',
        undefined,
      ],
    }
    mergeHighlightsOnSource(schema, {}, source, highlights)
    expect(source).toEqual({
      segments: [
        '<em>The</em> quick',
        'brown fox',
        'jumped <em>over</em>',
        'the lazy dog',
      ],
    })
  })

  it('should merge highlights on array of strings when source is empty', () => {
    const source = {}
    const highlights = {
      segments: ['<em>The</em> quick', 'jumped <em>over</em>'],
    }
    mergeHighlightsOnSource(schema, {}, source, highlights)
    expect(source).toEqual({
      segments: ['<em>The</em> quick', 'jumped <em>over</em>'],
    })
  })

  it('should merge highlights on array of objects when source has value', () => {
    const source = {
      segments: [
        { start: 0, text: 'The quick' },
        { start: 10, text: 'brown fox' },
        { start: 20, text: 'jumped over' },
        { start: 30, text: 'the lazy dog' },
      ],
    }
    const highlights = {
      segments: [
        { text: '<em>The</em> quick' },
        undefined,
        { text: 'jumped <em>over</em>' },
        undefined,
      ],
    }
    mergeHighlightsOnSource(schema, {}, source, highlights)
    expect(source).toEqual({
      segments: [
        { start: 0, text: '<em>The</em> quick' },
        { start: 10, text: 'brown fox' },
        { start: 20, text: 'jumped <em>over</em>' },
        { start: 30, text: 'the lazy dog' },
      ],
    })
  })

  it('should merge highlights on array of objects when source is empty', () => {
    const source = {}
    const highlights = {
      segments: [
        { text: '<em>The</em> quick' },
        { text: 'jumped <em>over</em>' },
      ],
    }
    mergeHighlightsOnSource(schema, {}, source, highlights)
    expect(source).toEqual({
      segments: [
        { text: '<em>The</em> quick' },
        { text: 'jumped <em>over</em>' },
      ],
    })
  })

  describe('filterSourceArrays', () => {
    it('should clear source array when highlight result is missing field', () => {
      const source = {
        segments: ['The quick', 'brown fox', 'jumped over', 'the lazy dog'],
      }
      const highlights = {}
      mergeHighlightsOnSource(
        schema,
        { filterSourceArrays: true },
        source,
        highlights
      )
      expect(source).toEqual({
        segments: [],
      })
    })

    it('should remove non-highlighted items from array of strings', () => {
      const source = {
        segments: ['The quick', 'brown fox', 'jumped over', 'the lazy dog'],
      }
      const highlights = {
        segments: [
          '<em>The</em> quick',
          undefined,
          'jumped <em>over</em>',
          undefined,
        ],
      }
      mergeHighlightsOnSource(
        schema,
        { filterSourceArrays: true },
        source,
        highlights
      )
      expect(source).toEqual({
        segments: ['<em>The</em> quick', 'jumped <em>over</em>'],
      })
    })

    it('should remove non-highlighted items from array of objects', () => {
      const source = {
        segments: [
          { start: 0, text: 'The quick' },
          { start: 10, text: 'brown fox' },
          { start: 20, text: 'jumped over' },
          { start: 30, text: 'the lazy dog' },
        ],
      }
      const highlights = {
        segments: [
          { text: '<em>The</em> quick' },
          undefined,
          { text: 'jumped <em>over</em>' },
          undefined,
        ],
      }
      mergeHighlightsOnSource(
        schema,
        { filterSourceArrays: true },
        source,
        highlights
      )
      expect(source).toEqual({
        segments: [
          { start: 0, text: '<em>The</em> quick' },
          { start: 20, text: 'jumped <em>over</em>' },
        ],
      })
    })
  })
})
