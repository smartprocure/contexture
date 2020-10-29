"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var F = _interopRequireWildcard(require("futil"));

var _mobxReact = require("mobx-react");

var _styles = _interopRequireDefault(require("../styles"));

var _greyVest = require("../greyVest");

var _OperatorMenu = _interopRequireDefault(require("./OperatorMenu"));

var _MoveTargets = require("./DragDrop/MoveTargets");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BlankOperator = function BlankOperator(_ref) {
  var open = _ref.open,
      node = _ref.node,
      child = _ref.child;
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    onClick: F.flip(open),
    style: _objectSpread(_objectSpread({}, _styles["default"].blankOperator), {}, {
      borderBottomColor: _styles["default"].joinColor(node.join)
    })
  }), child.children && child.join !== 'not' && /*#__PURE__*/_react["default"].createElement("div", {
    style: _objectSpread(_objectSpread(_objectSpread({}, _styles["default"].operatorLine), _styles["default"].blankOperatorLineExtended), _styles["default"].bgJoin(node))
  }));
};

var OperatorLine = (0, _mobxReact.observer)(function (_ref2) {
  var node = _ref2.node,
      child = _ref2.child,
      style = _ref2.style;
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, _styles["default"].operatorLine), child.children && child.join !== 'not' && _styles["default"].operatorLineExtended), _styles["default"].bgJoin(node)), style)
  });
});
OperatorLine.displayName = 'OperatorLine';

var JoinOperator = function JoinOperator(_ref3) {
  var open = _ref3.open,
      hover = _ref3.hover,
      node = _ref3.node,
      child = _ref3.child;
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    onClick: F.flip(open),
    style: _objectSpread(_objectSpread({}, _styles["default"].operator), _styles["default"].bgJoin(F.view(hover.join) || node))
  }, /*#__PURE__*/_react["default"].createElement("span", {
    style: _objectSpread({}, F.view(hover.join) && {
      fontStyle: 'italic',
      opacity: 0.5
    })
  }, F.view(hover.join) || node.join)), /*#__PURE__*/_react["default"].createElement(OperatorLine, {
    node: node,
    child: child
  }));
};

var Operator = function Operator(_ref4) {
  var hover = _ref4.hover,
      node = _ref4.node,
      child = _ref4.child,
      parent = _ref4.parent,
      tree = _ref4.tree,
      index = _ref4.index;

  var open = _react["default"].useState(false);

  return /*#__PURE__*/_react["default"].createElement("div", null, !(index !== 0 || node.join === 'not') ? /*#__PURE__*/_react["default"].createElement(BlankOperator, {
    open: open,
    node: node,
    child: child
  }) : /*#__PURE__*/_react["default"].createElement(JoinOperator, {
    open: open,
    node: node,
    child: child,
    hover: hover
  }), /*#__PURE__*/_react["default"].createElement(_MoveTargets.OperatorMoveTarget, {
    node: node,
    tree: tree,
    index: index
  }), /*#__PURE__*/_react["default"].createElement(_greyVest.Popover, {
    open: open,
    style: _objectSpread(_objectSpread(_objectSpread({}, _styles["default"].operatorPopover), _styles["default"].bdJoin(node)), F.view(hover.wrap) && {
      marginLeft: 0
    })
  }, /*#__PURE__*/_react["default"].createElement(_OperatorMenu["default"], {
    node: node,
    hover: hover,
    tree: tree,
    parent: parent
  })));
};

var _default = (0, _mobxReact.observer)(Operator);

exports["default"] = _default;
//# sourceMappingURL=Operator.js.map