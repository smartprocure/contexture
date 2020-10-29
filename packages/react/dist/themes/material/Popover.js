"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mobxReact = require("mobx-react");

var _utils = require("./utils");

var _react = require("../../utils/react");

var _core = require("@material-ui/core");

var _react2 = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var LensPopover = (0, _mobxReact.observer)((0, _react.expandProp)('open', _utils.openBinding)(_core.Menu));

var AnchoredPopover = function AnchoredPopover(_ref) {
  var props = _extends({}, _ref);

  var anchorRef = _react2["default"].useRef();

  return /*#__PURE__*/_react2["default"].createElement(_react2["default"].Fragment, null, /*#__PURE__*/_react2["default"].createElement("div", {
    ref: anchorRef
  }), /*#__PURE__*/_react2["default"].createElement(LensPopover, _extends({
    anchorEl: anchorRef.current
  }, props)));
};

var _default = AnchoredPopover;
exports["default"] = _default;
//# sourceMappingURL=Popover.js.map