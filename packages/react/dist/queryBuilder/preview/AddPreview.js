"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _styles = _interopRequireDefault(require("../../styles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AddPreview = function AddPreview(_ref) {
  var join = _ref.join,
      style = _ref.style,
      _onClick = _ref.onClick;
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      background: _styles["default"].background
    },
    onClick: function onClick() {
      return _onClick(join);
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: _objectSpread(_objectSpread(_objectSpread({}, _styles["default"].indentPreview), _styles["default"].bgPreview(join)), style)
  }, "Click to add", ' ', /*#__PURE__*/_react["default"].createElement("b", null, /*#__PURE__*/_react["default"].createElement("i", null, join.toUpperCase()))));
};

var _default = (0, _mobxReact.observer)(AddPreview);

exports["default"] = _default;
//# sourceMappingURL=AddPreview.js.map