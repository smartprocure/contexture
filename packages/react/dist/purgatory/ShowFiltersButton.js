"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _theme = require("../utils/theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ShowFiltersButton = function ShowFiltersButton(_ref) {
  var onClick = _ref.onClick,
      _ref$theme = _ref.theme,
      AlternateButton = _ref$theme.AlternateButton,
      Icon = _ref$theme.Icon;
  return /*#__PURE__*/_react["default"].createElement(AlternateButton, {
    title: "Show Filters",
    onClick: onClick
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: "FilterExpand"
  }));
};

var _default = (0, _theme.withTheme)(ShowFiltersButton);

exports["default"] = _default;
//# sourceMappingURL=ShowFiltersButton.js.map