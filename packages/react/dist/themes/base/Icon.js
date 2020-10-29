"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.iconMap = void 0;

var _react = _interopRequireDefault(require("react"));

var _greyVest = require("../../greyVest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var toIcon = function toIcon(symbol) {
  return function (props) {
    return /*#__PURE__*/_react["default"].createElement("span", props, symbol);
  };
};

var iconMap = {
  SortAscending: toIcon('▲'),
  SortDescending: toIcon('▼'),
  MoveLeft: toIcon('←'),
  MoveRight: toIcon('→'),
  RemoveColumn: toIcon('x'),
  AddColumn: toIcon('+'),
  FilterExpand: toIcon('>'),
  FilterCollapse: toIcon('V'),
  FilterAdd: toIcon('+'),
  TableColumnMenu: toIcon("".concat(String.fromCharCode(160), ":")),
  FilterListExpand: toIcon('◀'),
  FilterListCollapse: toIcon('▼'),
  TreePause: toIcon('⊖'),
  TreeUnpause: toIcon('⊕'),
  NextPage: toIcon('→'),
  PreviousPage: toIcon('←'),
  Previous5Pages: toIcon('⇜'),
  Next5Pages: toIcon('⇝'),
  Refresh: toIcon('⟳'),
  AutoUpdate: function AutoUpdate(_ref) {
    var style = _ref.style,
        props = _objectWithoutProperties(_ref, ["style"]);

    return /*#__PURE__*/_react["default"].createElement("span", _extends({
      style: _objectSpread({
        display: 'inline-flex',
        flexDirection: 'column'
      }, style)
    }, props), /*#__PURE__*/_react["default"].createElement("span", {
      style: {
        lineHeight: '0.8em'
      }
    }, "\u293A"), /*#__PURE__*/_react["default"].createElement("span", {
      style: {
        lineHeight: '1.2em',
        marginTop: '-0.5em'
      }
    }, "\u293B"));
  },
  New: function New() {
    return /*#__PURE__*/_react["default"].createElement("span", {
      style: {
        fontSize: '0.6em',
        padding: '0.5em 0.2em'
      }
    }, "NEW");
  },
  Expand: toIcon('v')
};
exports.iconMap = iconMap;

var DefaultIcon = function DefaultIcon(_ref2) {
  var icon = _ref2.icon,
      props = _objectWithoutProperties(_ref2, ["icon"]);

  return /*#__PURE__*/_react["default"].createElement(_greyVest.Dynamic, _extends({
    component: iconMap[icon]
  }, props));
};

var _default = DefaultIcon;
exports["default"] = _default;
//# sourceMappingURL=Icon.js.map