"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _recompose = require("recompose");

var _Flex = _interopRequireDefault(require("./Flex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ButtonGroup = (0, _recompose.defaultProps)({
  className: 'gv-button-group'
})(_Flex["default"]);
var _default = ButtonGroup;
exports["default"] = _default;
//# sourceMappingURL=ButtonGroup.js.map