"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withTheme = exports.withNamedTheme = exports.ThemeConsumer = exports.useTheme = exports.mergeNestedTheme = exports.ThemeProvider = exports.defaultTheme = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _futil2 = require("./futil");

var _react2 = require("./react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// We populate the default theme by mutating this in src/layout/index.js, to
// avoid importing withTheme-wrapped components before the function is defined.
var defaultTheme = {};
exports.defaultTheme = defaultTheme;

var ThemeContext = /*#__PURE__*/_react["default"].createContext(defaultTheme);

var ThemeProvider = function ThemeProvider(_ref) {
  var theme = _ref.theme,
      children = _ref.children;
  theme = _objectSpread(_objectSpread({}, defaultTheme), theme);
  var Root = theme.Root || _react["default"].Fragment;
  return /*#__PURE__*/_react["default"].createElement(ThemeContext.Provider, {
    value: theme
  }, /*#__PURE__*/_react["default"].createElement(Root, null, children));
};

exports.ThemeProvider = ThemeProvider;

var hasNested = function hasNested(key) {
  return _futil["default"].findIndexed(function (v, k) {
    return _fp["default"].startsWith("".concat(key, "."), k);
  });
};

var mergeNestedTheme = function mergeNestedTheme(theme, key) {
  return _futil["default"].when(hasNested(key), _fp["default"].flow(_fp["default"].pickBy(function (val, k) {
    return _fp["default"].startsWith("".concat(key, "."), k);
  }), _fp["default"].mapKeys(_fp["default"].replace("".concat(key, "."), '')), _fp["default"].defaults(theme)))(theme);
};

exports.mergeNestedTheme = mergeNestedTheme;

var useTheme = function useTheme(name, propTheme) {
  return (0, _futil2.mergeOrReturn)(mergeNestedTheme(_react["default"].useContext(ThemeContext), name), propTheme);
};

exports.useTheme = useTheme;

var ThemeConsumer = function ThemeConsumer(_ref2) {
  var name = _ref2.name,
      children = _ref2.children,
      theme = _ref2.theme;
  var newTheme = useTheme(name, theme);
  return /*#__PURE__*/_react["default"].createElement(ThemeContext.Provider, {
    value: newTheme
  }, children(newTheme));
};

exports.ThemeConsumer = ThemeConsumer;

var withNamedTheme = function withNamedTheme(name) {
  return function (Component) {
    var themed = function themed(_ref3) {
      var theme = _ref3.theme,
          props = _objectWithoutProperties(_ref3, ["theme"]);

      var newTheme = useTheme(name, theme);
      return /*#__PURE__*/_react["default"].createElement(ThemeContext.Provider, {
        value: newTheme
      }, /*#__PURE__*/_react["default"].createElement(Component, _extends({}, props, {
        theme: newTheme
      })));
    };

    themed.displayName = "withTheme".concat(name ? "(\"".concat(name, "\")") : '', "(").concat((0, _react2.getDisplayName)(Component), ")");
    return themed;
  };
};

exports.withNamedTheme = withNamedTheme;
var withTheme = withNamedTheme();
exports.withTheme = withTheme;
//# sourceMappingURL=theme.js.map