"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _mobxReact = require("mobx-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var RadioList = function RadioList(_ref) {
  var options = _ref.options,
      value = _ref.value,
      _onChange = _ref.onChange,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      _ref$native = _ref["native"],
      _native = _ref$native === void 0 ? false : _ref$native,
      props = _objectWithoutProperties(_ref, ["options", "value", "onChange", "className", "native"]);

  return /*#__PURE__*/_react["default"].createElement("div", _extends({
    className: "gv-radio-list ".concat(className)
  }, props), _fp["default"].map(function (option) {
    return /*#__PURE__*/_react["default"].createElement("label", {
      className: "gv-radio-option",
      key: option.value,
      style: {
        cursor: 'pointer',
        marginRight: 25
      }
    }, /*#__PURE__*/_react["default"].createElement("input", {
      type: "radio",
      style: {
        marginRight: 10,
        display: _native ? 'inline-block' : 'none',
        width: 'auto',
        height: 'auto'
      },
      onChange: function onChange() {
        return _onChange(option.value);
      },
      value: option.value,
      checked: value === option.value
    }), _native ? option.label : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
      className: "gv-radio"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "gv-radio-dot ".concat(value === option.value ? 'active' : '')
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "gv-radio-label"
    }, option.label)));
  }, options));
};

var _default = (0, _mobxReact.observer)(RadioList);

exports["default"] = _default;
//# sourceMappingURL=RadioList.js.map