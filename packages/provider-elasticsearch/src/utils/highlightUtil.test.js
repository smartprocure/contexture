import {
    mergeHitHighlights,
  } from './highlightUtil.js'

describe('Highlight field aggregation', () => {
    it('should combine subfield highlights with field highlights', () => {
      let hitHighlights = { 
        'foo.bar': ['<b class="search-highlight">foo</b> this handle'],
        'foo.bar.exact': ['foo this <b class="search-highlight">handle</b>'],
        'foo': ['foo this <b class="search-highlight">bar</b>'],
        'foo.exact': ['<b class="search-highlight">foo</b> this bar'],
        'foo.car.bar': ['<b class="search-highlight">foo</b> this is not merged'],
      }
      let fields = ['foo.bar', 'foo', 'foo.car.bar']
  
      let nodeHighlight = {
        pre_tags: ['<b class="search-highlight">'],
        post_tags:['</b>'],
      }
  
      expect(mergeHitHighlights(nodeHighlight, fields, hitHighlights)).toEqual(
        { 'foo.bar': ['<b class="search-highlight">foo</b> this <b class="search-highlight">handle</b>'],
          'foo': ['<b class="search-highlight">foo</b> this <b class="search-highlight">bar</b>'],
          'foo.car.bar': ['<b class="search-highlight">foo</b> this is not merged'],
        }
      )
    })
    it('should combine subfield highlights with field highlights1', () => {
        //remove all escape characters
        let hitHighlights = {
            "LineItem.Description.exact":['BRUSH,SCRUB: POT AND PAN SCRUB BRUSH WITH <b class="search-highlight">WOOD</b> HANDLE. BLOCK LENGTH 6-1/8" +1/2" - 1/8", WIDTH 2-1/2" +/- 1/4" 3/4" +1/4" = 1/8". FILLER 1-3/8"U/I EA. CARLISLE BRUSH P/N 365015 OR EQUAL'],
            "PO.Description":['BRUSH,SCRUB: POT AND PAN SCRUB BRUSH WITH WOOD HANDLE. BLOCK LENGTH 6-1/8" +1/2" - 1/8", WIDTH 2-1/2" +/- 1/4" 3/4" +1/4" = 1/8". <b class="search-highlight">FILLER</b> 1-3/8"U/I EA. CARLISLE BRUSH P/N 365015 OR EQUAL'],
            "LineItem.Description":['BRUSH,SCRUB: POT AND PAN SCRUB BRUSH WITH WOOD HANDLE. BLOCK LENGTH 6-1/8" +1/2" - 1/8", WIDTH 2-1/2" +/- 1/4" 3/4" +1/4" = 1/8". <b class="search-highlight">FILLER</b> 1-3/8"U/I EA. CARLISLE BRUSH P/N 365015 OR EQUAL']
        }
        let fields = ['LineItem.Description', 'PO.Description' ]
    
        let nodeHighlight = {
          pre_tags: ['<b class="search-highlight">'],
          post_tags:['</b>'],
        }
    
        expect(mergeHitHighlights(nodeHighlight, fields, hitHighlights)).toEqual(
          {
            "LineItem.Description": ['BRUSH,SCRUB: POT AND PAN SCRUB BRUSH WITH <b class="search-highlight">WOOD</b> HANDLE. BLOCK LENGTH 6-1/8" +1/2" - 1/8", WIDTH 2-1/2" +/- 1/4" 3/4" +1/4" = 1/8". <b class="search-highlight">FILLER</b> 1-3/8"U/I EA. CARLISLE BRUSH P/N 365015 OR EQUAL'],
            "PO.Description": ['BRUSH,SCRUB: POT AND PAN SCRUB BRUSH WITH WOOD HANDLE. BLOCK LENGTH 6-1/8" +1/2" - 1/8", WIDTH 2-1/2" +/- 1/4" 3/4" +1/4" = 1/8". <b class="search-highlight">FILLER</b> 1-3/8"U/I EA. CARLISLE BRUSH P/N 365015 OR EQUAL'],
          }
        )
      })
  })