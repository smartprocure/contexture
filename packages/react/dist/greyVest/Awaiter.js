"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Awaiter = function Awaiter(_ref) {
  var promise = _ref.promise,
      children = _ref.children;
  return promise["case"]({
    pending: function pending() {
      return /*#__PURE__*/_react["default"].createElement("div", null, "Loading...");
    },
    rejected: function rejected(error) {
      return /*#__PURE__*/_react["default"].createElement("div", null, "Ooops.. ", error);
    },
    fulfilled: function fulfilled(value) {
      return /*#__PURE__*/_react["default"].createElement("div", null, children(value));
    }
  });
};

var _default = (0, _mobxReact.observer)(Awaiter);

exports["default"] = _default;
//# sourceMappingURL=Awaiter.js.map