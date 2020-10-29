"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react = _interopRequireDefault(require("react"));

var _greyVest = require("../greyVest");

var _theme = require("../utils/theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var CheckButton = function CheckButton(_ref) {
  var theme = _ref.theme,
      _ref$checked = _ref.checked,
      checked = _ref$checked === void 0 ? false : _ref$checked,
      onClick = _ref.onClick,
      children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, ["theme", "checked", "onClick", "children", "className"]);

  return /*#__PURE__*/_react["default"].createElement(theme.Button, _extends({
    onClick: onClick,
    className: "check-button ".concat(className || '')
  }, props), /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    alignItems: "center",
    justifyContent: "center"
  }, /*#__PURE__*/_react["default"].createElement(theme.Checkbox, {
    checked: !!checked // prevent react "uncontrolled component" warning when `checked` prop is undefined
    ,
    onChange: _fp["default"].noop // prevent another react warning when `checked` is passed but `onChange` isn't
    ,
    disabled: true
  }), children));
};

var _default = (0, _theme.withTheme)(CheckButton);

exports["default"] = _default;
//# sourceMappingURL=CheckButton.js.map