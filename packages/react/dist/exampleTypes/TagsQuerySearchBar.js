"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _futil = _interopRequireDefault(require("futil"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _mobxReact = require("mobx-react");

var _reactOutsideClickHandler = _interopRequireDefault(require("react-outside-click-handler"));

var _hoc = require("../utils/hoc");

var _greyVest = require("../greyVest");

var _ExpandableTagsInput = _interopRequireWildcard(require("../greyVest/ExpandableTagsInput"));

var _ExpandableTagsQuery = _interopRequireDefault(require("./ExpandableTagsQuery"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var searchBarStyle = {
  overflow: 'visible' // for the search button animation

};
var searchBarBoxStyle = {
  padding: '8px 10px',
  flex: 1
};
var inputStyle = {
  border: 'none'
};
var buttonStyle = {
  boxShadow: '0 2px 10px 0 rgba(39, 44, 65, 0.1)',
  fontSize: 18,
  maxHeight: 56
};

var AnimatedButton = function AnimatedButton(_ref) {
  var disabled = _ref.disabled,
      style = _ref.style,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, ["disabled", "style", "className"]);

  return /*#__PURE__*/_react["default"].createElement(_greyVest.Button, _extends({
    className: "".concat(disabled ? 'disabled' : 'animated pulse infinite', " ").concat(className || '') // BG Color is 50% white + primary button background, replacing 50% opacity
    ,
    style: _objectSpread(_objectSpread(_objectSpread({}, style), disabled ? {
      backgroundColor: '#80BBEF'
    } : {}), {}, {
      animationDuration: '500ms'
    }),
    primary: true
  }, props));
};

var SearchButton = (0, _mobxReact.observer)(function (_ref2) {
  var tree = _ref2.tree,
      resultsPath = _ref2.resultsPath,
      searchButtonProps = _ref2.searchButtonProps;
  return /*#__PURE__*/_react["default"].createElement(AnimatedButton, _extends({
    disabled: !tree.getNode(resultsPath).markedForUpdate,
    onClick: tree.triggerUpdate,
    style: buttonStyle
  }, searchButtonProps), "Search");
});

var SearchBar = function SearchBar(_ref3) {
  var tree = _ref3.tree,
      node = _ref3.node,
      resultsPath = _ref3.resultsPath,
      actionWrapper = _ref3.actionWrapper,
      searchButtonProps = _ref3.searchButtonProps;

  var collapse = _react["default"].useState(true);

  return /*#__PURE__*/_react["default"].createElement(_reactOutsideClickHandler["default"], {
    onOutsideClick: function onOutsideClick() {
      _futil["default"].on(collapse)();
    }
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.ButtonGroup, {
    style: searchBarStyle
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.Box, {
    style: searchBarBoxStyle,
    onClick: _futil["default"].off(collapse)
  }, /*#__PURE__*/_react["default"].createElement(_ExpandableTagsQuery["default"], _extends({
    tree: tree,
    node: node,
    collapse: collapse,
    actionWrapper: actionWrapper
  }, {
    onAddTag: _futil["default"].off(collapse),
    Loader: function Loader(_ref4) {
      var children = _ref4.children;
      return /*#__PURE__*/_react["default"].createElement("div", null, children);
    },
    style: inputStyle,
    theme: {
      TagsInput: _futil["default"].view(collapse) && !_fp["default"].isEmpty(node.tags) ? _ExpandableTagsInput.Tags : _ExpandableTagsInput["default"]
    },
    autoFocus: true
  }))), tree.disableAutoUpdate && /*#__PURE__*/_react["default"].createElement(SearchButton, {
    tree: tree,
    resultsPath: resultsPath,
    searchButtonProps: searchButtonProps
  })));
};

var _default = _fp["default"].flow(_mobxReact.observer, _hoc.withNode)(SearchBar);

exports["default"] = _default;
//# sourceMappingURL=TagsQuerySearchBar.js.map