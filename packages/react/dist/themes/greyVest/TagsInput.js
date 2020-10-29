"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Tag = void 0;

var _react = _interopRequireDefault(require("react"));

var _recompose = require("recompose");

var _greyVest = require("../../greyVest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var RemoveIcon = function RemoveIcon(props) {
  return /*#__PURE__*/_react["default"].createElement("span", _extends({
    className: "tags-input-tag-remove fa fa-times"
  }, props));
};

var Tag = (0, _recompose.defaultProps)({
  RemoveIcon: RemoveIcon
})(_greyVest.Tag);
exports.Tag = Tag;

var _default = (0, _recompose.defaultProps)({
  Tag: Tag
})(_greyVest.TagsInput);

exports["default"] = _default;
//# sourceMappingURL=TagsInput.js.map