"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aspectWrapper = exports.mergeOrReturn = exports.flattenPlainObject = exports.PlainObjectTree = exports.FlattenTreeLeaves = exports.onlyWhen = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var F = _interopRequireWildcard(require("futil"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Logic
var onlyWhen = function onlyWhen(f) {
  return F.unless(f, function () {});
}; // Tree


exports.onlyWhen = onlyWhen;

var FlattenTreeLeaves = function FlattenTreeLeaves(Tree) {
  return _fp["default"].flow(Tree.flatten(), _fp["default"].omitBy(Tree.traverse));
};

exports.FlattenTreeLeaves = FlattenTreeLeaves;
var PlainObjectTree = F.tree(onlyWhen(_fp["default"].isPlainObject));
exports.PlainObjectTree = PlainObjectTree;
var flattenPlainObject = F.whenExists(FlattenTreeLeaves(PlainObjectTree));
exports.flattenPlainObject = flattenPlainObject;

var canMerge = function canMerge(a) {
  return !_fp["default"].isEmpty(a) && a;
};

var mergeOrReturn = _fp["default"].curry(function (a, b) {
  return canMerge(a) && canMerge(b) && _fp["default"].merge(a, b) || canMerge(a) || canMerge(b) || {};
});

exports.mergeOrReturn = mergeOrReturn;
var aspectWrapper = F.aspect({
  after: function after(result) {
    return console.info('"after" aspect fired!', result);
  },
  onError: function onError(e) {
    return console.error('"onError" aspect fired!', e);
  }
});
exports.aspectWrapper = aspectWrapper;
//# sourceMappingURL=futil.js.map