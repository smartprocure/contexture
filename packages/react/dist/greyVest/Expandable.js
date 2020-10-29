"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _Flex = _interopRequireDefault(require("./Flex"));

var _Icon = _interopRequireDefault(require("./Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Expandable = function Expandable(_ref) {
  var isOpen = _ref.isOpen,
      className = _ref.className,
      style = _ref.style,
      Label = _ref.Label,
      children = _ref.children,
      onClick = _ref.onClick;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "gv-expandable ".concat(isOpen ? 'expanded' : '', " ").concat(className),
    style: style
  }, /*#__PURE__*/_react["default"].createElement(_Flex["default"], {
    className: "gv-expandable-header",
    alignItems: "center",
    onClick: onClick
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flexGrow: 1
    }
  }, Label), /*#__PURE__*/_react["default"].createElement("div", {
    className: "gv-expandable-icon ".concat(isOpen ? 'expanded' : '')
  }, /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
    icon: "FilterListExpand"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "gv-expandable-body ".concat(isOpen ? 'expanded' : '')
  }, children));
};

var _default = Expandable;
exports["default"] = _default;
//# sourceMappingURL=Expandable.js.map