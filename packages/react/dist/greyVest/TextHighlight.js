"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var F = _interopRequireWildcard(require("futil"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DefaultWrap = function DefaultWrap(props) {
  return /*#__PURE__*/_react["default"].createElement("b", _extends({
    style: {
      backgroundColor: 'yellow'
    }
  }, props));
}; // Since start and end are the same token, splitting on it means every even element was a match


var TextHighlight = function TextHighlight(_ref) {
  var pattern = _ref.pattern,
      text = _ref.text,
      _ref$Wrap = _ref.Wrap,
      Wrap = _ref$Wrap === void 0 ? DefaultWrap : _ref$Wrap;
  return pattern ? F.highlight('<>', '<>', pattern, text).split('<>').map(function (x, i) {
    return i % 2 ? /*#__PURE__*/_react["default"].createElement(Wrap, {
      key: i
    }, x) : x;
  }) : text;
};

var _default = TextHighlight;
exports["default"] = _default;
//# sourceMappingURL=TextHighlight.js.map