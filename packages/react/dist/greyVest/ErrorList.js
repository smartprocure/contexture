"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _futil = _interopRequireDefault(require("futil"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _greyVest = require("../greyVest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var ErrorText = function ErrorText(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "gv-text-error"
  }, children);
};

var ErrorBlock = function ErrorBlock(_ref2) {
  var children = _ref2.children,
      props = _objectWithoutProperties(_ref2, ["children"]);

  return /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, _extends({
    className: "gv-block-error",
    alignItems: "center"
  }, props), /*#__PURE__*/_react["default"].createElement("i", {
    className: "material-icons",
    style: {
      marginRight: 8
    }
  }, "warning"), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(ErrorList, null, children)));
};

var ErrorList = function ErrorList(_ref3) {
  var _ref3$block = _ref3.block,
      block = _ref3$block === void 0 ? false : _ref3$block,
      children = _ref3.children;
  return _futil["default"].mapIndexed(function (e, i) {
    return block ? /*#__PURE__*/_react["default"].createElement(ErrorBlock, {
      key: i
    }, e) : /*#__PURE__*/_react["default"].createElement(ErrorText, {
      key: i
    }, e);
  }, _fp["default"].castArray(children));
};

var _default = ErrorList;
exports["default"] = _default;
//# sourceMappingURL=ErrorList.js.map