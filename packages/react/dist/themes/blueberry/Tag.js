"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _futil = _interopRequireDefault(require("futil"));

var _mobxReact = require("mobx-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Tag = function Tag(_ref) {
  var value = _ref.value,
      removeTag = _ref.removeTag,
      tagStyle = _ref.tagStyle,
      onClick = _ref.onClick;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "tags-input-tag",
    style: _objectSpread({
      display: 'inline-block'
    }, _futil["default"].callOrReturn(tagStyle, value)),
    onClick: onClick
  }, value, /*#__PURE__*/_react["default"].createElement("span", {
    className: "tags-input-tag-remove fa fa-times",
    onClick: function onClick() {
      return removeTag(value);
    }
  }));
};

var _default = (0, _mobxReact.observer)(Tag);

exports["default"] = _default;
//# sourceMappingURL=Tag.js.map