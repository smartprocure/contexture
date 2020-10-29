"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _mobxReact = require("mobx-react");

var _hoc = require("../utils/hoc");

var _format = require("../utils/format");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ResultCount = function ResultCount(_ref) {
  var node = _ref.node,
      _ref$display = _ref.display,
      display = _ref$display === void 0 ? _format.toNumber : _ref$display;

  var count = _futil["default"].cascade(['context.response.results.length', 'context.results.length'], node);

  var totalRecords = count ? _futil["default"].cascade(['context.response.totalRecords', 'context.totalRecords'], node) : 0;
  return count ? display(totalRecords) : 'No Results';
};

var _default = _fp["default"].flow(_mobxReact.observer, _hoc.withNode, _hoc.withInlineLoader)(ResultCount);

exports["default"] = _default;
//# sourceMappingURL=ResultCount.js.map