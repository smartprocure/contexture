"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _hoc = require("../utils/hoc");

var _theme = require("../utils/theme");

var _recompose = require("recompose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var LensInput = function LensInput(_ref) {
  var lens = _ref.lens,
      TextInput = _ref.theme.TextInput,
      props = _objectWithoutProperties(_ref, ["lens", "theme"]);

  return /*#__PURE__*/_react["default"].createElement(TextInput, _extends({}, _futil["default"].domLens.value(lens), props));
};

var Text = _fp["default"].flow((0, _recompose.setDisplayName)('Text'), _mobxReact.observer, _hoc.withTreeLens, _hoc.withNode, _hoc.withLoader, _theme.withTheme)(LensInput);

var _default = Text;
exports["default"] = _default;
//# sourceMappingURL=Text.js.map