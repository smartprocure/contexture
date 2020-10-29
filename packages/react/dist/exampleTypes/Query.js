"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _hoc = require("../utils/hoc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Query = function Query(_ref) {
  var tree = _ref.tree,
      node = _ref.node,
      TextInput = _ref.theme.TextInput;
  return /*#__PURE__*/_react["default"].createElement(TextInput, {
    value: node.query || '',
    onChange: function onChange(e) {
      return tree.mutate(node.path, {
        query: e.target.value
      });
    },
    placeholder: "Search"
  });
};

var _default = (0, _hoc.contexturify)(Query);

exports["default"] = _default;
//# sourceMappingURL=Query.js.map