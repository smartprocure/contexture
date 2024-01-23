import { mergeHighlights } from './util.js'

let tags = { pre: '<em>', post: '</em>' }

describe('mergeHighlights()', () => {
  it('should merge highlights that do not overlap', () => {
    let actual = mergeHighlights(tags, [
      'The <em>quick</em> brown fox jumps over the lazy dog',
      'The quick brown <em>fox jumps</em> over the lazy dog',
    ])
    expect(actual).toEqual(
      'The <em>quick</em> brown <em>fox jumps</em> over the lazy dog'
    )
  })

  it('should merge highlights that overlap', () => {
    let actual = mergeHighlights(tags, [
      '<em>The quick</em> brown <em>fox jumps</em> over the lazy dog',
      'The quick brown fox <em>jumps over</em> the lazy dog',
    ])
    expect(actual).toEqual(
      '<em>The quick</em> brown <em>fox jumps over</em> the lazy dog'
    )
  })

  it('should merge highlights that are contained within another', () => {
    let actual = mergeHighlights(tags, [
      'The quick brown fox <em>jumps</em> over the lazy dog',
      'The quick brown <em>fox jumps over</em> the lazy dog',
    ])
    expect(actual).toEqual(
      'The quick brown <em>fox jumps over</em> the lazy dog'
    )
  })

  it('should merge highlights at the end of the string', () => {
    let actual = mergeHighlights(tags, [
      'The quick brown fox <em>jumps</em> over the lazy dog',
      'The quick brown fox jumps over the lazy <em>dog</em>',
    ])
    expect(actual).toEqual(
      'The quick brown fox <em>jumps</em> over the lazy <em>dog</em>'
    )
  })
})
