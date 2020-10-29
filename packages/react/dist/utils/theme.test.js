"use strict";

var _theme = require("./theme");

var _fp = _interopRequireDefault(require("lodash/fp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

test('mergeNestedTheme', function () {
  var theme = {
    A: 'a',
    B: 'b',
    'A.B': 'a.b',
    'A.C': 'a.c',
    'A.C.B': 'a.c.b',
    'B.B': 'b.b',
    'B.B.B': 'b.b.b'
  };
  expect((0, _theme.mergeNestedTheme)(theme, 'A')).toEqual({
    A: 'a',
    B: 'a.b',
    // <-- (changed)
    C: 'a.c',
    // <--
    'A.B': 'a.b',
    'A.C': 'a.c',
    'A.C.B': 'a.c.b',
    'B.B': 'b.b',
    'B.B.B': 'b.b.b',
    'C.B': 'a.c.b' // <--

  });
  expect((0, _theme.mergeNestedTheme)(theme, 'B')).toEqual({
    A: 'a',
    B: 'b.b',
    // <--
    'A.B': 'a.b',
    'A.C': 'a.c',
    'A.C.B': 'a.c.b',
    'B.B': 'b.b.b',
    // <--
    'B.B.B': 'b.b.b'
  });
  expect((0, _theme.mergeNestedTheme)(theme, 'C')).toEqual(theme);
  expect(_fp["default"].reduce(_theme.mergeNestedTheme, theme, ['A', 'C'])).toEqual({
    A: 'a',
    B: 'a.c.b',
    // <--<--
    C: 'a.c',
    // <--
    'A.B': 'a.b',
    'A.C': 'a.c',
    'A.C.B': 'a.c.b',
    'B.B': 'b.b',
    'B.B.B': 'b.b.b',
    'C.B': 'a.c.b' // <--

  });
  expect((0, _theme.mergeNestedTheme)(theme)).toEqual(theme); // edge case: do we want this to equal {} instead?

  expect((0, _theme.mergeNestedTheme)()).toEqual(undefined);
});
//# sourceMappingURL=theme.test.js.map