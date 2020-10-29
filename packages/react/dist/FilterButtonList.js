"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _futil = _interopRequireDefault(require("futil"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react = _interopRequireDefault(require("react"));

var _recompose = require("recompose");

var _greyVest = require("./greyVest");

var _purgatory = require("./purgatory");

var _hoc = require("./utils/hoc");

var _theme = require("./utils/theme");

var _styles = _interopRequireDefault(require("./styles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FilterButtonItem = _fp["default"].flow((0, _recompose.setDisplayName)('FilterButtonItem'), _hoc.withLoader, _theme.withTheme)(function (_ref) {
  var node = _ref.node,
      tree = _ref.tree,
      fields = _ref.fields,
      mapNodeToProps = _ref.mapNodeToProps,
      _ref$theme = _ref.theme,
      Button = _ref$theme.Button,
      UnmappedNodeComponent = _ref$theme.UnmappedNodeComponent,
      Modal = _ref$theme.Modal;
  var mappedProps = mapNodeToProps(node, fields);

  var modal = _react["default"].useState(false);

  var title = // we really need a title, so here's every possible fallback
  _fp["default"].get('label', mappedProps) || _fp["default"].get([node.field, 'label'], fields) || node.field || node.key;

  var description = _fp["default"].get('description', mappedProps);

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_purgatory.CheckButton, {
    checked: node.hasValue,
    onClick: _futil["default"].on(modal)
  }, title), /*#__PURE__*/_react["default"].createElement(Modal, {
    open: modal
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "filter-button-modal"
  }, /*#__PURE__*/_react["default"].createElement("h1", null, title), description && /*#__PURE__*/_react["default"].createElement("div", {
    className: "filter-description"
  }, description), /*#__PURE__*/_react["default"].createElement("div", {
    className: "filter-component"
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.Dynamic, _objectSpread({
    component: UnmappedNodeComponent,
    tree: tree,
    node: node,
    path: _fp["default"].toArray(node.path)
  }, mappedProps))), /*#__PURE__*/_react["default"].createElement(Button, {
    onClick: function onClick() {
      return tree.clear(node.path);
    }
  }, "Clear"), /*#__PURE__*/_react["default"].createElement(Button, {
    primary: true,
    onClick: _futil["default"].off(modal)
  }, "Done"))));
});

var GroupBox = function GroupBox(_ref2) {
  var nodeJoinColor = _ref2.nodeJoinColor,
      children = _ref2.children,
      nested = _ref2.nested,
      className = _ref2.className;
  return /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    wrap: true,
    className: "".concat(className, " ").concat(nested ? 'nested' : ''),
    alignItems: "center",
    style: {
      borderColor: nodeJoinColor
    }
  }, children);
};

var FilterButtonList = function FilterButtonList(_ref3) {
  var node = _ref3.node,
      tree = _ref3.tree,
      _ref3$fields = _ref3.fields,
      fields = _ref3$fields === void 0 ? {} : _ref3$fields,
      _ref3$mapNodeToProps = _ref3.mapNodeToProps,
      mapNodeToProps = _ref3$mapNodeToProps === void 0 ? _fp["default"].noop : _ref3$mapNodeToProps,
      _ref3$className = _ref3.className,
      className = _ref3$className === void 0 ? 'filter-button-list' : _ref3$className,
      _ref3$nested = _ref3.nested,
      nested = _ref3$nested === void 0 ? false : _ref3$nested;
  return /*#__PURE__*/_react["default"].createElement(GroupBox, _extends({
    nested: nested,
    className: className
  }, {
    nodeJoinColor: node && _styles["default"].joinColor(node)
  }), _fp["default"].map(function (child) {
    var Component = child.children ? FilterButtonList : FilterButtonItem;
    return /*#__PURE__*/_react["default"].createElement(Component, _extends({
      key: child.path,
      nested: true
    }, {
      tree: tree,
      node: child,
      fields: fields,
      mapNodeToProps: mapNodeToProps,
      className: className
    }));
  }, _fp["default"].get('children', node)));
};

var _default = (0, _hoc.withNode)(FilterButtonList);

exports["default"] = _default;
//# sourceMappingURL=FilterButtonList.js.map