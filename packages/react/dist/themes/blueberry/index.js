"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _recompose = require("recompose");

var _react = _interopRequireDefault(require("react"));

var _Button = _interopRequireDefault(require("./Button"));

var _ButtonRadio = _interopRequireDefault(require("./ButtonRadio"));

var _Checkbox = _interopRequireDefault(require("./Checkbox"));

var _Fonts = _interopRequireDefault(require("./Fonts"));

var _DropdownItem = _interopRequireDefault(require("./DropdownItem"));

var _PagerItem = _interopRequireDefault(require("./PagerItem"));

var _Style = _interopRequireDefault(require("./Style"));

var _Tag = _interopRequireDefault(require("./Tag"));

var _TextInput = _interopRequireDefault(require("./TextInput"));

var _greyVest = require("../../greyVest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  AlternateButton: _greyVest.TextButton,
  Box: _greyVest.Box,
  Button: _Button["default"],
  ButtonGroup: _greyVest.ButtonGroup,
  Checkbox: _Checkbox["default"],
  Fonts: _Fonts["default"],
  Root: function Root(_ref) {
    var children = _ref.children;
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_Style["default"], null), /*#__PURE__*/_react["default"].createElement(_Fonts["default"], null), children);
  },
  DropdownItem: _DropdownItem["default"],
  NumberInput: (0, _recompose.defaultProps)({
    type: 'number'
  })(_TextInput["default"]),
  PagerItem: _PagerItem["default"],
  NestedPicker: (0, _recompose.defaultProps)({
    PickerItem: _DropdownItem["default"]
  })(_greyVest.NestedPicker),
  RadioList: _ButtonRadio["default"],
  Style: _Style["default"],
  Table: _greyVest.Table,
  TagsInput: (0, _recompose.defaultProps)({
    Tag: _Tag["default"]
  })(_greyVest.TagsInput),
  TextInput: _TextInput["default"]
};
exports["default"] = _default;
//# sourceMappingURL=index.js.map