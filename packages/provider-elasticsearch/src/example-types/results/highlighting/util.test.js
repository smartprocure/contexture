import { mergeHighlights } from './util.js'

const config = { pre_tag: '<em>', post_tag: '</em>' }

describe('mergeHighlights()', () => {
  it('should merge highlights that do not overlap', () => {
    const actual = mergeHighlights(
      config,
      'The <em>quick</em> brown fox jumps over the lazy dog',
      'The quick brown <em>fox jumps</em> over the lazy dog'
    )
    const expected =
      'The <em>quick</em> brown <em>fox jumps</em> over the lazy dog'
    expect(actual).toEqual(expected)
  })

  it('should merge highlights that overlap', () => {
    const actual = mergeHighlights(
      config,
      'The quick brown fox <em>jumps over</em> the lazy dog',
      'The quick brown <em>fox jumps</em> over the lazy dog'
    )
    const expected = 'The quick brown <em>fox jumps over</em> the lazy dog'
    expect(actual).toEqual(expected)
  })

  it('should merge highlights that are contained within another', () => {
    const actual = mergeHighlights(
      config,
      'The quick brown fox <em>jumps</em> over the lazy dog',
      'The quick brown <em>fox jumps over</em> the lazy dog'
    )
    const expected = 'The quick brown <em>fox jumps over</em> the lazy dog'
    expect(actual).toEqual(expected)
  })

  it('should merge highlights at the end of the string', () => {
    const actual = mergeHighlights(
      config,
      'The quick brown fox <em>jumps</em> over the lazy dog',
      'The quick brown fox jumps over the lazy <em>dog</em>'
    )
    const expected =
      'The quick brown fox <em>jumps</em> over the lazy <em>dog</em>'
    expect(actual).toEqual(expected)
  })
})
