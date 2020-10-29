"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pickers = require("@material-ui/pickers");

var _recompose = require("recompose");

var _mobxReact = require("mobx-react");

var _utils = require("./utils");

var _react = require("../../utils/react");

var _core = require("@material-ui/core");

var _RadioList = _interopRequireDefault(require("./RadioList"));

var _TagsInput = _interopRequireDefault(require("./TagsInput"));

var _Icon = _interopRequireDefault(require("./Icon"));

var _Popover = _interopRequireDefault(require("./Popover"));

var _Select = _interopRequireDefault(require("./Select"));

var _Tag = _interopRequireDefault(require("./Tag"));

var _Root = _interopRequireDefault(require("./Root"));

var _Box = _interopRequireDefault(require("./Box"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  Box: _Box["default"],
  Button: (0, _recompose.defaultProps)({
    variant: 'contained'
  })(_core.Button),
  AlternateButton: _core.Button,
  Checkbox: _core.Checkbox,
  DateInput: (0, _recompose.defaultProps)({
    variant: 'inline',
    disableToolbar: true
  })(_pickers.KeyboardDatePicker),
  Icon: _Icon["default"],
  DropdownItem: _core.MenuItem,
  PickerItem: _core.MenuItem,
  Modal: (0, _mobxReact.observer)((0, _react.expandProp)('open', _utils.openBinding)(_core.Dialog)),
  NumberInput: (0, _recompose.defaultProps)({
    type: 'number',
    fullWidth: true
  })(_core.Input),
  Popover: _Popover["default"],
  RadioList: _RadioList["default"],
  Root: _Root["default"],
  Select: _Select["default"],
  Table: (0, _recompose.defaultProps)({
    className: 'material-table'
  })(_core.Table),
  Tag: _Tag["default"],
  TagsInput: _TagsInput["default"],
  TextInput: (0, _recompose.defaultProps)({
    fullWidth: true
  })(_core.Input)
};
exports["default"] = _default;
//# sourceMappingURL=index.js.map