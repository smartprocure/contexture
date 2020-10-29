"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectedBinding = void 0;

var _futil = _interopRequireDefault(require("futil"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var selectedBinding = function selectedBinding() {
  for (var _len = arguments.length, lens = new Array(_len), _key = 0; _key < _len; _key++) {
    lens[_key] = arguments[_key];
  }

  return {
    selectedValues: _futil["default"].view.apply(_futil["default"], lens),
    onChange: function onChange(x) {
      return _futil["default"].set.apply(_futil["default"], [x].concat(lens));
    }
  };
};

exports.selectedBinding = selectedBinding;
//# sourceMappingURL=utils.js.map