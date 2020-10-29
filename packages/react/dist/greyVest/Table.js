"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Table = function Table(x) {
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "gv-table-parent"
  }, /*#__PURE__*/_react["default"].createElement("table", _extends({
    className: "gv-table"
  }, x)));
};

var _default = Table;
exports["default"] = _default;
//# sourceMappingURL=Table.js.map