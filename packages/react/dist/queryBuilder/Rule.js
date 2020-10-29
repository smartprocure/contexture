"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _styles = _interopRequireDefault(require("../styles"));

var _Indentable = _interopRequireDefault(require("./preview/Indentable"));

var _FilterContents = _interopRequireDefault(require("./FilterContents"));

var _FilterDragSource = _interopRequireDefault(require("./DragDrop/FilterDragSource"));

var _search = require("../utils/search");

var _react2 = require("../utils/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Rule = function Rule(_ref) {
  var node = _ref.node,
      parent = _ref.parent,
      tree = _ref.tree,
      connectDragSource = _ref.connectDragSource,
      isDragging = _ref.isDragging,
      props = _objectWithoutProperties(_ref, ["node", "parent", "tree", "connectDragSource", "isDragging"]);

  var hover = (0, _react2.useLensObject)({
    indent: false,
    remove: false,
    rule: false
  });
  return connectDragSource( /*#__PURE__*/_react["default"].createElement("div", {
    style: _styles["default"].w100
  }, /*#__PURE__*/_react["default"].createElement(_Indentable["default"], {
    parent: parent,
    indent: hover.indent
  }, /*#__PURE__*/_react["default"].createElement("div", _extends({
    style: _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, _styles["default"].condition), _styles["default"].bdJoin(parent)), _futil["default"].view(hover.remove) && _objectSpread({
      borderStyle: 'dashed',
      opacity: 0.25
    }, _styles["default"].bgStriped)), isDragging && {
      opacity: 0.25
    }), _futil["default"].view(hover.rule) && {
      background: _styles["default"].background
    })
  }, _futil["default"].domLens.hover(hover.rule)), /*#__PURE__*/_react["default"].createElement(_FilterContents["default"], _objectSpread({
    node: node,
    tree: tree
  }, props)), /*#__PURE__*/_react["default"].createElement("div", {
    style: _objectSpread(_objectSpread({}, _futil["default"].view(hover.rule) || {
      visibility: 'hidden'
    }), {}, {
      minWidth: 82
    })
  }, /*#__PURE__*/_react["default"].createElement("button", _extends({}, _futil["default"].domLens.hover(hover.indent), {
    style: _objectSpread(_objectSpread({
      color: _styles["default"].joinColor((0, _search.oppositeJoin)(parent.join))
    }, _styles["default"].btn), _styles["default"].roundedRight0),
    onClick: function onClick() {
      return (0, _search.indent)(tree, parent, node);
    }
  }), ">"), /*#__PURE__*/_react["default"].createElement("button", _extends({}, _futil["default"].domLens.hover(hover.remove), {
    style: _objectSpread(_objectSpread(_objectSpread({}, _styles["default"].btn), _styles["default"].roundedLeft0), {}, {
      marginLeft: '-1px'
    }),
    onClick: function onClick() {
      return tree.remove(node.path);
    }
  }), "X"))))));
};

var _default = _fp["default"].flow(_mobxReact.observer, _FilterDragSource["default"])(Rule);

exports["default"] = _default;
//# sourceMappingURL=Rule.js.map