"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _fp = _interopRequireDefault(require("lodash/fp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Textarea = function Textarea(props, ref) {
  return /*#__PURE__*/_react["default"].createElement("textarea", _extends({
    className: "gv-input"
  }, props, {
    ref: ref
  }));
};

var _default = _fp["default"].flow(_react["default"].forwardRef, _mobxReact.observer)(Textarea);

exports["default"] = _default;
//# sourceMappingURL=Textarea.js.map