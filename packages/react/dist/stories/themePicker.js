"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ThemeSwitcher = void 0;

var _react = _interopRequireDefault(require("react"));

var _futil = _interopRequireDefault(require("futil"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _greyVest = _interopRequireDefault(require("../themes/greyVest"));

var _blueberry = _interopRequireDefault(require("../themes/blueberry"));

var _base = _interopRequireDefault(require("../themes/base"));

var _material = _interopRequireDefault(require("../themes/material"));

var _theme = require("../utils/theme");

var _greyVest2 = require("../greyVest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var themes = {
  base: _base["default"],
  blueberry: _blueberry["default"],
  greyVest: _greyVest["default"],
  material: _material["default"]
};

var ThemeSwitcher = function ThemeSwitcher(_ref) {
  var _ref$defaultTheme = _ref.defaultTheme,
      defaultTheme = _ref$defaultTheme === void 0 ? 'base' : _ref$defaultTheme,
      children = _ref.children;

  var theme = _react["default"].useState(defaultTheme);

  return /*#__PURE__*/_react["default"].createElement(_theme.ThemeProvider, {
    theme: themes[_futil["default"].view(theme)]
  }, /*#__PURE__*/_react["default"].createElement(_theme.ThemeConsumer, null, function (_ref2) {
    var Box = _ref2.Box,
        Select = _ref2.Select;
    return /*#__PURE__*/_react["default"].createElement(Box, null, /*#__PURE__*/_react["default"].createElement(_greyVest2.Flex, {
      alignItems: "center"
    }, /*#__PURE__*/_react["default"].createElement("p", {
      className: "filter-field-label",
      style: {
        margin: 0,
        marginRight: 8
      }
    }, "Current theme:"), /*#__PURE__*/_react["default"].createElement(Select, _extends({
      options: _futil["default"].autoLabelOptions(_fp["default"].keys(themes))
    }, _futil["default"].domLens.value(theme), {
      placeholder: false,
      style: {
        width: 'auto',
        minWidth: 200
      }
    }))));
  }), children);
};

exports.ThemeSwitcher = ThemeSwitcher;

var _default = function _default(defaultTheme) {
  return function (Story) {
    return /*#__PURE__*/_react["default"].createElement(ThemeSwitcher, {
      defaultTheme: defaultTheme
    }, /*#__PURE__*/_react["default"].createElement(Story, null));
  };
};

exports["default"] = _default;
//# sourceMappingURL=themePicker.js.map