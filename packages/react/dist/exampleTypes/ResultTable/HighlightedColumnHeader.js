"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _mobxReact = require("mobx-react");

var _schema = require("../../utils/schema");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var HighlightedColumnHeader = function HighlightedColumnHeader(_ref) {
  var node = _ref.node,
      _ref$results = _ref.results,
      results = _ref$results === void 0 ? _fp["default"].result('slice', (0, _schema.getResults)(node)) : _ref$results,
      _ref$Cell = _ref.Cell,
      Cell = _ref$Cell === void 0 ? 'th' : _ref$Cell,
      _ref$hasAdditionalFie = _ref.hasAdditionalFields,
      hasAdditionalFields = _ref$hasAdditionalFie === void 0 ? !_fp["default"].flow(_fp["default"].map('additionalFields'), _fp["default"].compact, _fp["default"].isEmpty)(results) : _ref$hasAdditionalFie;
  return hasAdditionalFields && node.showOtherMatches ? /*#__PURE__*/_react["default"].createElement(Cell, {
    key: "additionalFields"
  }, "Other Matches") : null;
};

var _default = (0, _mobxReact.observer)(HighlightedColumnHeader);

exports["default"] = _default;
//# sourceMappingURL=HighlightedColumnHeader.js.map