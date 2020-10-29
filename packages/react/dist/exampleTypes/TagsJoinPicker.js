"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.tagToGroupJoin = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _fp = _interopRequireDefault(require("lodash/fp"));

var _theme = require("../utils/theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var tagToGroupJoin = function tagToGroupJoin() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'any';
  return {
    any: 'or',
    all: 'and',
    none: 'not'
  }[x];
};

exports.tagToGroupJoin = tagToGroupJoin;
var joinOptions = [{
  value: 'any',
  label: 'Match any of these keywords'
}, {
  value: 'all',
  label: 'Match all of these keywords'
}, {
  value: 'none',
  label: 'Match none of these keywords'
}];

var TagsJoinPicker = function TagsJoinPicker(_ref) {
  var node = _ref.node,
      tree = _ref.tree,
      Select = _ref.theme.Select;
  return /*#__PURE__*/_react["default"].createElement(Select, {
    value: node.join,
    onChange: function onChange(e) {
      return tree.mutate(node.path, {
        join: e.target.value
      });
    },
    options: joinOptions,
    placeholder: false
  });
};

var _default = _fp["default"].flow(_mobxReact.observer, _theme.withTheme)(TagsJoinPicker);

exports["default"] = _default;
//# sourceMappingURL=TagsJoinPicker.js.map