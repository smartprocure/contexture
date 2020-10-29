"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.PagerItem = void 0;

var _react = _interopRequireDefault(require("react"));

var _futil = _interopRequireDefault(require("futil"));

var _mobxReact = require("mobx-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var PagerItem = function PagerItem(_ref) {
  var active = _ref.active,
      disabled = _ref.disabled,
      _ref$style = _ref.style,
      style = _ref$style === void 0 ? {} : _ref$style,
      props = _objectWithoutProperties(_ref, ["active", "disabled", "style"]);

  var hovering = _react["default"].useState(false);

  return /*#__PURE__*/_react["default"].createElement("span", _extends({
    style: _objectSpread(_objectSpread(_objectSpread({
      padding: '5px',
      background: _futil["default"].view(hovering) || disabled ? '#f5f5f5' : 'white',
      border: '2px solid #EDEDED',
      borderRadius: '4px'
    }, active && {
      fontWeight: 'bold',
      borderColor: '#0076DE',
      color: '#0076DE'
    }), disabled && {
      pointerEvents: 'none'
    }), {}, {
      cursor: disabled ? 'not-allowed' : 'pointer'
    }, style)
  }, _futil["default"].domLens.hover(hovering), props));
};

exports.PagerItem = PagerItem;

var _default = (0, _mobxReact.observer)(PagerItem);

exports["default"] = _default;
//# sourceMappingURL=PagerItem.js.map