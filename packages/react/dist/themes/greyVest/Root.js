"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _greyVest = require("../../greyVest");

var _Style = _interopRequireDefault(require("./Style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Root = function Root(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_greyVest.Fonts, null), /*#__PURE__*/_react["default"].createElement(_greyVest.Style, null), /*#__PURE__*/_react["default"].createElement(_Style["default"], null), children);
};

var _default = Root;
exports["default"] = _default;
//# sourceMappingURL=Root.js.map