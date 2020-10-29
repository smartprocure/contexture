"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _greyVest = require("../greyVest");

var _TextButton = _interopRequireDefault(require("./TextButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var SmallIcon = function SmallIcon(_ref) {
  var icon = _ref.icon,
      style = _ref.style,
      props = _objectWithoutProperties(_ref, ["icon", "style"]);

  return /*#__PURE__*/_react["default"].createElement("i", _extends({
    className: "material-icons",
    style: _objectSpread({
      fontSize: 20
    }, style)
  }, props), icon);
};

var toIcon = function toIcon(id) {
  return function (props) {
    return /*#__PURE__*/_react["default"].createElement(SmallIcon, _extends({
      icon: id
    }, props));
  };
};

var iconMap = {
  SortAscending: toIcon('expand_less'),
  SortDescending: toIcon('expand_more'),
  MoveLeft: toIcon('chevron_left'),
  MoveRight: toIcon('chevron_right'),
  RemoveColumn: toIcon('remove'),
  AddColumn: toIcon('add'),
  FilterExpand: toIcon('filter_alt'),
  FilterCollapse: toIcon('filter_list'),
  FilterAdd: toIcon('filter_list'),
  FilterApply: toIcon('fact_check'),
  TableColumnMenu: function TableColumnMenu() {
    return /*#__PURE__*/_react["default"].createElement(_TextButton["default"], null, /*#__PURE__*/_react["default"].createElement(SmallIcon, {
      icon: "more_vert"
    }));
  },
  FilterListExpand: toIcon('keyboard_arrow_down'),
  FilterListCollapse: toIcon('keyboard_arrow_up'),
  TreePause: toIcon('unfold_less'),
  TreeUnpause: toIcon('unfold_more'),
  PreviousPage: toIcon('chevron_left'),
  NextPage: toIcon('chevron_right'),
  Previous5Pages: function Previous5Pages() {
    return /*#__PURE__*/_react["default"].createElement("span", null, "...");
  },
  Next5Pages: function Next5Pages() {
    return /*#__PURE__*/_react["default"].createElement("span", null, "...");
  },
  Refresh: function Refresh() {
    return /*#__PURE__*/_react["default"].createElement(_TextButton["default"], {
      className: "animated pulse slow infinite",
      style: {
        animationDuration: '500ms'
      }
    }, /*#__PURE__*/_react["default"].createElement(SmallIcon, {
      icon: "refresh"
    }));
  },
  AutoUpdate: toIcon('autorenew'),
  New: toIcon('fiber_new'),
  Expand: toIcon('keyboard_arrow_down')
};

var Icon = function Icon(_ref2) {
  var icon = _ref2.icon,
      props = _objectWithoutProperties(_ref2, ["icon"]);

  return /*#__PURE__*/_react["default"].createElement(_greyVest.Dynamic, _extends({
    component: iconMap[icon] || toIcon(icon)
  }, props));
};

var _default = Icon;
exports["default"] = _default;
//# sourceMappingURL=Icon.js.map