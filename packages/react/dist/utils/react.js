"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.explodeProp = exports.expandProp = exports.wrapDisplayName = exports.getDisplayName = exports.useLensObject = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var F = _interopRequireWildcard(require("futil"));

var _react = require("react");

var _recompose = require("recompose");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var useLensObject = _fp["default"].mapValues(_react.useState);

exports.useLensObject = useLensObject;

var getDisplayName = function getDisplayName(Component) {
  return F.cascade(['displayName', 'name'], Component) || 'Unknown';
};

exports.getDisplayName = getDisplayName;

var wrapDisplayName = function wrapDisplayName(name, Component) {
  return function (Wrapped) {
    Wrapped.displayName = "".concat(name, "(").concat(getDisplayName(Component), ")");
    return Wrapped;
  };
}; // (k, a -> {b}) -> Component<{k: a}> -> Component<{k: a, ...b}>


exports.wrapDisplayName = wrapDisplayName;

var expandProp = _fp["default"].flow(function (key, fn) {
  return F.expandObjectBy(key, F.whenExists(fn));
}, _recompose.mapProps); // (k, a -> {b}) -> Component<{k: a}> -> Component<{...b}>


exports.expandProp = expandProp;

var explodeProp = _fp["default"].flow(function (key, fn) {
  return _fp["default"].flow(F.expandObjectBy(key, F.whenExists(fn)), _fp["default"].omit(key));
}, _recompose.mapProps);

exports.explodeProp = explodeProp;
//# sourceMappingURL=react.js.map