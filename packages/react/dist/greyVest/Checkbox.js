"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// Low effort custom checkbox
var Checkbox = /*#__PURE__*/_react["default"].forwardRef(function (_ref, ref) {
  var checked = _ref.checked,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === void 0 ? function () {} : _ref$onChange,
      _ref$style = _ref.style,
      style = _ref$style === void 0 ? {} : _ref$style;
  return /*#__PURE__*/_react["default"].createElement("label", {
    className: "gv-input gv-checkbox ".concat(checked ? 'checked' : ''),
    style: style,
    ref: ref
  }, /*#__PURE__*/_react["default"].createElement("input", _extends({
    type: "checkbox",
    style: {
      display: 'none'
    }
  }, {
    checked: checked,
    onChange: onChange
  })), checked ? /*#__PURE__*/_react["default"].createElement("i", {
    className: "material-icons"
  }, "check") : String.fromCharCode(160) // non-breaking space
  );
});

var _default = Checkbox;
exports["default"] = _default;
//# sourceMappingURL=Checkbox.js.map