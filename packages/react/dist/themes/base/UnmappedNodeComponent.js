"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _hoc = require("../../utils/hoc");

var _greyVest = require("../../greyVest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var UnmappedNodeComponent = function UnmappedNodeComponent(_ref) {
  var _ref$node = _ref.node,
      node = _ref$node === void 0 ? {} : _ref$node;
  return (
    /*#__PURE__*/
    // Min Height here is to align better in QueryBuilder
    _react["default"].createElement(_greyVest.Flex, {
      style: {
        minHeight: '40px',
        alignItems: 'center'
      }
    }, /*#__PURE__*/_react["default"].createElement(_greyVest.ErrorList, null, "Type ", /*#__PURE__*/_react["default"].createElement("b", null, node.type), " is not supported (for key ", /*#__PURE__*/_react["default"].createElement("i", null, node.key), ")"))
  );
};

var _default = (0, _hoc.withNode)(UnmappedNodeComponent);

exports["default"] = _default;
//# sourceMappingURL=UnmappedNodeComponent.js.map