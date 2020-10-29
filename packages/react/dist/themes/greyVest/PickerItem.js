"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _greyVest = require("../../greyVest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var PickerItem = function PickerItem(_ref) {
  var active = _ref.active,
      disabled = _ref.disabled,
      hasChildren = _ref.hasChildren,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ["active", "disabled", "hasChildren", "children"]);

  return /*#__PURE__*/_react["default"].createElement("div", _extends({
    style: {
      padding: '10px 40px',
      cursor: 'pointer',
      fontSize: 18,
      background: active ? '#ebebeb' : '#fff',
      color: disabled ? '#9b9b9b' : '#000'
    }
  }, props), hasChildren ? /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    style: {
      alignItems: 'center'
    }
  }, children, /*#__PURE__*/_react["default"].createElement("i", {
    className: "material-icons",
    style: {
      fontSize: 20
    }
  }, "chevron_right")) : children);
};

var _default = (0, _mobxReact.observer)(PickerItem);

exports["default"] = _default;
//# sourceMappingURL=PickerItem.js.map