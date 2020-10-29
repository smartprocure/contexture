"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openBinding = void 0;

var _futil = _interopRequireDefault(require("futil"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var openBinding = function openBinding() {
  return {
    isOpen: _futil["default"].view.apply(_futil["default"], arguments),
    onClose: _futil["default"].off.apply(_futil["default"], arguments)
  };
};

exports.openBinding = openBinding;
//# sourceMappingURL=utils.js.map