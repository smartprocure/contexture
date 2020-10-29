"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toNumber = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var toNumber = function toNumber(number) {
  if (_fp["default"].isNumber(number)) {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    var formatter = Intl.NumberFormat(params);
    return formatter.format(number);
  }

  return NaN;
};

exports.toNumber = toNumber;
//# sourceMappingURL=format.js.map