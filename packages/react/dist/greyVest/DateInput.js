"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _moment = _interopRequireDefault(require("moment"));

var _reactDatePicker = _interopRequireDefault(require("react-date-picker"));

var _fp = _interopRequireDefault(require("lodash/fp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var NativeDateInput = function NativeDateInput(_ref) {
  var value = _ref.value,
      _onChange = _ref.onChange,
      props = _objectWithoutProperties(_ref, ["value", "onChange"]);

  return /*#__PURE__*/_react["default"].createElement("input", _extends({
    type: "date",
    value: value ? (0, _moment["default"])(value).format('YYYY-MM-DD') : '',
    onChange: function onChange(e) {
      return _onChange(new Date(e.target.value));
    }
  }, props));
};

var ReactDatePickerInput = function ReactDatePickerInput(_ref2) {
  var value = _ref2.value,
      _ref2$calendarIcon = _ref2.calendarIcon,
      calendarIcon = _ref2$calendarIcon === void 0 ? null : _ref2$calendarIcon,
      _ref2$clearIcon = _ref2.clearIcon,
      clearIcon = _ref2$clearIcon === void 0 ? null : _ref2$clearIcon,
      props = _objectWithoutProperties(_ref2, ["value", "calendarIcon", "clearIcon"]);

  return /*#__PURE__*/_react["default"].createElement(_reactDatePicker["default"], _extends({
    calendarType: 'US',
    calendarIcon: calendarIcon,
    clearIcon: clearIcon,
    value: _fp["default"].isDate(value) || _fp["default"].isEmpty(value) ? value : new Date(value)
  }, props));
};

var DateInput = function DateInput(_ref3) {
  var value = _ref3.value,
      _ref3$native = _ref3["native"],
      _native = _ref3$native === void 0 ? false : _ref3$native,
      props = _objectWithoutProperties(_ref3, ["value", "native"]);

  return _native ? /*#__PURE__*/_react["default"].createElement(NativeDateInput, _extends({
    value: value
  }, props)) : /*#__PURE__*/_react["default"].createElement(ReactDatePickerInput, _extends({
    value: value
  }, props));
};

var _default = (0, _mobxReact.observer)(DateInput);

exports["default"] = _default;
//# sourceMappingURL=DateInput.js.map