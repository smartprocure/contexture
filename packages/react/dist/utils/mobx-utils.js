"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.has = exports.get = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _mobx = require("mobx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Until https://github.com/mobxjs/mobx/issues/1549 is resolved
var get = function get(obj, path) {
  return ((0, _mobx.isObservable)(obj) ? _mobx.get : _lodash["default"].get)(obj, path);
};

exports.get = get;

var has = function has(obj, path) {
  return ((0, _mobx.isObservable)(obj) ? _mobx.has : _lodash["default"].has)(obj, path);
};

exports.has = has;
//# sourceMappingURL=mobx-utils.js.map