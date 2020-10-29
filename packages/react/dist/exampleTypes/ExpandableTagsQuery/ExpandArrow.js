"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _futil = _interopRequireDefault(require("futil"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _mobxReact = require("mobx-react");

var _greyVest = require("../../greyVest");

var _theme = require("../../utils/theme");

var _utils = require("../TagsQuery/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ExpandArrow = function ExpandArrow(_ref) {
  var collapse = _ref.collapse,
      tagsLength = _ref.tagsLength,
      style = _ref.style,
      Icon = _ref.theme.Icon;
  return !!(_futil["default"].view(collapse) && tagsLength) && /*#__PURE__*/_react["default"].createElement("div", {
    className: "expand-arrow",
    onClick: _futil["default"].off(collapse),
    style: style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: 0,
      cursor: 'pointer',
      textAlign: 'center'
    },
    title: "Expand to see all tags"
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    style: {
      display: 'inline-flex',
      backgroundColor: 'white',
      borderRadius: 4,
      padding: '5px 12px',
      boxShadow: '0 1px 4px 0 rgba(39, 44, 65, 0.1)',
      color: '#9b9b9b',
      fontWeight: 400
    },
    alignItems: "center",
    justifyContent: "center"
  }, "View all ", tagsLength, " ", _utils.tagTerm, "s", /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: "Expand",
    style: {
      fontSize: 16,
      marginLeft: 6
    }
  }))));
};

var _default = _fp["default"].flow(_mobxReact.observer, _theme.withTheme)(ExpandArrow);

exports["default"] = _default;
//# sourceMappingURL=ExpandArrow.js.map