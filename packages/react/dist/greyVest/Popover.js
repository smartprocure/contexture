"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _reactjsPopup = _interopRequireDefault(require("reactjs-popup"));

var _utils = require("./utils");

var _react2 = require("../utils/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Self-contained state management:
 * <Popover trigger={<Button/>} />
 *
 * External state management:
 * <Popover isOpen={bool} onClose={fn} />
 *
 * Also with openBinding for a state lens
 * <Popover open={lens} />
 **/
var Popover = function Popover(_ref) {
  var _trigger = _ref.trigger,
      isOpen = _ref.isOpen,
      onClose = _ref.onClose,
      arrow = _ref.arrow,
      position = _ref.position,
      _ref$closeOnDocumentC = _ref.closeOnDocumentClick,
      closeOnDocumentClick = _ref$closeOnDocumentC === void 0 ? true : _ref$closeOnDocumentC,
      _ref$closeOnPopoverCl = _ref.closeOnPopoverClick,
      closeOnPopoverClick = _ref$closeOnPopoverCl === void 0 ? true : _ref$closeOnPopoverCl,
      arrowStyle = _ref.arrowStyle,
      contentStyle = _ref.contentStyle,
      style = _ref.style,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ["trigger", "isOpen", "onClose", "arrow", "position", "closeOnDocumentClick", "closeOnPopoverClick", "arrowStyle", "contentStyle", "style", "children"]);

  return /*#__PURE__*/_react["default"].createElement(_reactjsPopup["default"] // always passing trigger, otherwise it opens as fullscreen modal
  , _extends({
    trigger: function trigger(open) {
      return /*#__PURE__*/_react["default"].createElement("span", null, _futil["default"].callOrReturn(_trigger, open));
    },
    open: isOpen,
    onClose: onClose,
    arrow: arrow,
    position: position || 'bottom left',
    closeOnDocumentClick: closeOnDocumentClick,
    arrowStyle: _objectSpread({
      // matching arrow style with the popover body
      margin: '-6px',
      borderRight: '1px solid rgb(235, 235, 235)',
      borderBottom: '1px solid rgb(235, 235, 235)',
      boxShadow: 'rgba(39, 44, 65, 0.05) 2px 2px 3px'
    }, arrowStyle),
    contentStyle: _objectSpread(_objectSpread({
      borderRadius: 3,
      border: '1px solid rgb(235, 235, 235)',
      boxShadow: '0 2px 10px 0 rgba(39, 44, 65, 0.1)'
    }, contentStyle), style)
  }, props), function (close) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      onClick: closeOnPopoverClick ? close : null
    }, _fp["default"].isFunction(children) ? children(close) : children);
  });
};

var _default = (0, _react2.explodeProp)('open', _utils.openBinding)(Popover);

exports["default"] = _default;
//# sourceMappingURL=Popover.js.map