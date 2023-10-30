import { mergeHitHighlights } from './highlightUtil.js'

let nodeHighlight = {
  pre_tags: ['<em>'],
  post_tags: ['</em>'],
}

describe('mergeHitHighlights()', () => {
  it('should combine subfield highlights with field highlights: that do not overlap', () => {
    let hitHighlights = {
      'foo.bar': ['<em>foo</em> this handle'],
      'foo.bar.exact': ['foo this <em>handle</em>'],
      foo: ['foo this <em>bar</em>'],
      'foo.exact': ['<em>foo</em> this bar'],
      'foo.car.bar': ['<em>foo</em> this is not merged'],
    }
    let fields = ['foo.bar.exact', 'foo.exact']

    expect(mergeHitHighlights(nodeHighlight, fields, hitHighlights)).toEqual({
      'foo.bar': ['<em>foo</em> this <em>handle</em>'],
      foo: ['<em>foo</em> this <em>bar</em>'],
      'foo.car.bar': ['<em>foo</em> this is not merged'],
    })
  })
  it('should combine subfield highlights with field highlights: that overlap', () => {
    let hitHighlights = {
      'foo.bar': ['<em>foo this</em> car handle'],
      'foo.bar.exact': ['foo <em>this car</em> handle'],
      foo: ['foo this <em>stop gap bar</em>'],
      'foo.exact': ['foo <em>this stop</em> gap bar'],
    }
    let fields = ['foo.bar.exact', 'foo.exact']

    expect(mergeHitHighlights(nodeHighlight, fields, hitHighlights)).toEqual({
      'foo.bar': ['<em>foo this car</em> handle'],
      foo: ['foo <em>this stop gap bar</em>'],
    })
  })
  it('should combine subfield highlights with field highlights: that are contained within another', () => {
    let hitHighlights = {
      'foo.bar': ['<em>foo this</em> car handle'],
      'foo.bar.exact': ['foo <em>this</em> car handle'],
      foo: ['foo this <em>stop gap bar</em>'],
      'foo.exact': ['foo this stop <em>gap</em> bar'],
      'foo.car.bar': ['<em>foo</em> this is not merged'],
    }
    let fields = ['foo.bar.exact', 'foo.exact']

    expect(mergeHitHighlights(nodeHighlight, fields, hitHighlights)).toEqual({
      'foo.bar': ['<em>foo this</em> car handle'],
      foo: ['foo this <em>stop gap bar</em>'],
      'foo.car.bar': ['<em>foo</em> this is not merged'],
    })
  })
})
