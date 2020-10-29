"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _futil = _interopRequireDefault(require("futil"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _theme = require("../utils/theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ModalPicker = function ModalPicker(_ref) {
  var _ref$options = _ref.options,
      options = _ref$options === void 0 ? [] : _ref$options,
      _onChange = _ref.onChange,
      label = _ref.label,
      _ref$theme = _ref.theme,
      Button = _ref$theme.Button,
      NestedPicker = _ref$theme.NestedPicker,
      Modal = _ref$theme.Modal;

  var open = _react["default"].useState(false);

  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(Modal, {
    open: open
  }, /*#__PURE__*/_react["default"].createElement(NestedPicker, {
    options: options,
    onChange: function onChange(x) {
      _onChange(x);

      _futil["default"].off(open)();
    }
  })), !!options.length && /*#__PURE__*/_react["default"].createElement(Button, {
    onClick: _futil["default"].on(open)
  }, label));
};

var _default = _fp["default"].flow(_mobxReact.observer, _theme.withTheme)(ModalPicker);

exports["default"] = _default;
//# sourceMappingURL=ModalPicker.js.map