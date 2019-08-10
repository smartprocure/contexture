import { mergeNestedTheme } from '../src/utils/theme'
import _ from 'lodash/fp'

test('mergeNestedTheme', () => {
  let theme = {
    A: 'a',
    B: 'b',
    'A.B': 'a.b',
    'A.C': 'a.c',
    'A.C.B': 'a.c.b',
    'B.B': 'b.b',
    'B.B.B': 'b.b.b'
  }
  expect(mergeNestedTheme(theme, 'A')).toEqual({
    A: 'a',
    B: 'a.b', // <--
    C: 'a.c', // <--
    'A.B': 'a.b',
    'A.C': 'a.c',
    'A.C.B': 'a.c.b',
    'B.B': 'b.b',
    'B.B.B': 'b.b.b',
    'C.B': 'a.c.b' // <--
  })
  expect(mergeNestedTheme(theme, 'B')).toEqual({
    A: 'a',
    B: 'b.b', // <--
    'A.B': 'a.b',
    'A.C': 'a.c',
    'A.C.B': 'a.c.b',
    'B.B': 'b.b.b', // <--
    'B.B.B': 'b.b.b'
  })
  expect(mergeNestedTheme(theme, 'C')).toEqual(theme)
  expect(_.reduce(mergeNestedTheme, theme, ['A', 'C'])).toEqual({
    A: 'a',
    B: 'a.c.b', // <--<--
    C: 'a.c', // <--
    'A.B': 'a.b',
    'A.C': 'a.c',
    'A.C.B': 'a.c.b',
    'B.B': 'b.b',
    'B.B.B': 'b.b.b',
    'C.B': 'a.c.b' // <--
  })
  expect(mergeNestedTheme(theme)).toEqual(theme)
  // edge case: do we want this to equal {} instead?
  expect(mergeNestedTheme()).toEqual(undefined)
})
