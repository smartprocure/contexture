"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withTreeLens = exports.contexturifyWithoutLoader = exports.contexturify = exports.withInlineLoader = exports.withLoader = exports.withNode = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _fp = _interopRequireDefault(require("lodash/fp"));

var _greyVest = require("../greyVest");

var _react2 = require("./react");

var _theme = require("./theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var withNode = function withNode(Component) {
  return (0, _react2.wrapDisplayName)('withNode', Component)(function (props) {
    var tree = props.tree,
        node = props.node,
        path = props.path;
    node = node || tree && path && tree.getNode(path);
    if (!node) throw Error("Node not provided, and couldn't find node at ".concat(path));
    return /*#__PURE__*/_react["default"].createElement(Component, _extends({}, props, {
      node: node
    }));
  });
};

exports.withNode = withNode;

var withLoader = function withLoader(Component) {
  return _fp["default"].flow((0, _react2.wrapDisplayName)('withLoader', Component), _mobxReact.observer)(function (_ref) {
    var Loader = _ref.Loader,
        props = _objectWithoutProperties(_ref, ["Loader"]);

    var _props$theme = props.theme,
        theme = _props$theme === void 0 ? {} : _props$theme,
        node = props.node;
    Loader = Loader || theme.Loader || _greyVest.StripedLoader;
    return /*#__PURE__*/_react["default"].createElement(Loader, {
      loading: node && node.updating
    }, /*#__PURE__*/_react["default"].createElement(Component, _extends({
      node: node
    }, props)));
  });
}; // I am a band-aid, please rip me off as quickly as possible


exports.withLoader = withLoader;

var withInlineLoader = function withInlineLoader(Component) {
  return _fp["default"].flow((0, _react2.wrapDisplayName)('withInlineLoader', Component), _mobxReact.observer)(function (_ref2) {
    var Loader = _ref2.Loader,
        props = _objectWithoutProperties(_ref2, ["Loader"]);

    var _props$theme2 = props.theme,
        theme = _props$theme2 === void 0 ? {} : _props$theme2,
        node = props.node;
    Loader = Loader || theme.Loader || _greyVest.StripedLoader;
    return /*#__PURE__*/_react["default"].createElement(Loader, {
      loading: node && node.updating,
      style: {
        display: 'inline-block'
      }
    }, /*#__PURE__*/_react["default"].createElement(Component, props));
  });
};

exports.withInlineLoader = withInlineLoader;

var contexturify = _fp["default"].flow(_mobxReact.observer, withLoader, withNode, _theme.withTheme);

exports.contexturify = contexturify;

var contexturifyWithoutLoader = _fp["default"].flow(_mobxReact.observer, withNode, _theme.withTheme); // this is used for the text components


exports.contexturifyWithoutLoader = contexturifyWithoutLoader;

var withTreeLens = function withTreeLens(Component) {
  return (0, _react2.wrapDisplayName)('withTreeLens', Component)(function (_ref3) {
    var _ref3$prop = _ref3.prop,
        prop = _ref3$prop === void 0 ? 'value' : _ref3$prop,
        props = _objectWithoutProperties(_ref3, ["prop"]);

    return /*#__PURE__*/_react["default"].createElement(Component, _objectSpread({
      lens: props.tree.lens(props.node.path, prop)
    }, props));
  });
};

exports.withTreeLens = withTreeLens;
//# sourceMappingURL=hoc.js.map