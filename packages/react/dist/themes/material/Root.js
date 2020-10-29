"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _core = require("@material-ui/core");

var _moment = _interopRequireDefault(require("@date-io/moment"));

var _pickers = require("@material-ui/pickers");

var _Style = _interopRequireDefault(require("./Style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Root = function Root(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("link", {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
  }), /*#__PURE__*/_react["default"].createElement("link", {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/icon?family=Material+Icons"
  }), /*#__PURE__*/_react["default"].createElement(_Style["default"], null), /*#__PURE__*/_react["default"].createElement(_core.CssBaseline, null), /*#__PURE__*/_react["default"].createElement(_pickers.MuiPickersUtilsProvider, {
    utils: _moment["default"]
  }, children));
};

var _default = Root;
exports["default"] = _default;
//# sourceMappingURL=Root.js.map