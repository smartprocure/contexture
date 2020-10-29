"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _futil = _interopRequireDefault(require("futil"));

var _react = _interopRequireDefault(require("react"));

var _recompose = require("recompose");

var _greyVest = require("../../greyVest");

var _Icon = _interopRequireDefault(require("./Icon"));

var _UnmappedNodeComponent = _interopRequireDefault(require("./UnmappedNodeComponent"));

var _theme = require("../../utils/theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var theme = {
  AlternateButton: 'button',
  BarChart: _greyVest.BarChart,
  Box: 'div',
  Button: 'button',
  ButtonGroup: 'div',
  Checkbox: function Checkbox(props) {
    return /*#__PURE__*/_react["default"].createElement("input", _extends({
      type: "checkbox"
    }, props));
  },
  DateInput: (0, _recompose.defaultProps)({
    "native": true
  })(_greyVest.DateInput),
  UnmappedNodeComponent: _UnmappedNodeComponent["default"],
  Icon: _Icon["default"],
  Input: 'input',
  DropdownItem: 'li',
  Modal: _greyVest.Modal,
  NumberInput: function NumberInput(props) {
    return /*#__PURE__*/_react["default"].createElement("input", _extends({
      type: "number"
    }, props));
  },
  NestedPicker: _greyVest.NestedPicker,
  PagerItem: function PagerItem(_ref) {
    var children = _ref.children;
    return /*#__PURE__*/_react["default"].createElement("span", null, children);
  },
  Popover: _greyVest.Popover,
  RadioList: (0, _recompose.defaultProps)({
    "native": true
  })(_greyVest.RadioList),
  Select: _greyVest.Select,
  Table: 'table',
  Tag: _greyVest.Tag,
  TagsInput: _greyVest.TagsInput,
  TextHighlight: _greyVest.TextHighlight,
  TextInput: 'input'
}; // To add `withTheme` components to the default theme, we have to mutate them onto
// the theme object after it's declared, because importing them into `utils/theme`
// before ThemeContext is initialized would cause dependency conflicts

_futil["default"].mergeOn(_theme.defaultTheme, theme);

var _default = theme;
exports["default"] = _default;
//# sourceMappingURL=index.js.map