"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var F = _interopRequireWildcard(require("futil"));

var _mobxReact = require("mobx-react");

var _styles = _interopRequireDefault(require("../styles"));

var _Indentable = _interopRequireDefault(require("./preview/Indentable"));

var _AddPreview = _interopRequireDefault(require("./preview/AddPreview"));

var _Operator = _interopRequireDefault(require("./Operator"));

var _Rule = _interopRequireDefault(require("./Rule"));

var _FilterDragSource = _interopRequireDefault(require("./DragDrop/FilterDragSource"));

var _IndentTarget = require("./DragDrop/IndentTarget");

var _MoveTargets = require("./DragDrop/MoveTargets");

var _search = require("../utils/search");

var _react2 = require("../utils/react");

var _recompose = require("recompose");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var background = _styles["default"].background;
var GroupItem = (0, _FilterDragSource["default"])(function (props) {
  var child = props.child,
      node = props.node,
      index = props.index,
      tree = props.tree,
      adding = props.adding,
      isRoot = props.isRoot,
      parent = props.parent,
      connectDragSource = props.connectDragSource,
      hover = props.hover;
  var Component = child.children ? Group : _Rule["default"];
  return connectDragSource( /*#__PURE__*/_react["default"].createElement("div", {
    style: _objectSpread(_objectSpread({}, _styles["default"].dFlex), index === node.children.length - 1 && !F.view(adding) && {
      background: background
    })
  }, !(isRoot && node.children.length === 1) && /*#__PURE__*/_react["default"].createElement(_Operator["default"], {
    node: node,
    child: child,
    tree: tree,
    parent: parent,
    index: index,
    hover: hover
  }), /*#__PURE__*/_react["default"].createElement(Component, _extends({}, props, {
    node: child,
    parent: node
  }))));
}); // we need to observe this here and not on the export because Group is referenced elsewhere in the file

var Group = _fp["default"].flow((0, _recompose.setDisplayName)('Group'), _mobxReact.observer)(function (props) {
  var parent = props.parent,
      node = props.node,
      tree = props.tree,
      adding = props.adding,
      isRoot = props.isRoot;
  var hover = (0, _react2.useLensObject)({
    wrap: false,
    join: '',
    remove: false
  });
  return /*#__PURE__*/_react["default"].createElement(_Indentable["default"], {
    parent: parent,
    indent: hover.wrap
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, _styles["default"].conditions), !isRoot && _styles["default"].w100), _styles["default"].bdJoin(node)), F.view(hover.remove) && _objectSpread(_objectSpread({}, _styles["default"].bgStriped), {}, {
      borderColor: background
    }))
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: _objectSpread(_objectSpread({}, _styles["default"].conditionsInner), F.view(hover.remove) && {
      opacity: 0.25
    })
  }, F.mapIndexed(function (child, index) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: child.key + index
    }, /*#__PURE__*/_react["default"].createElement(_IndentTarget.FilterIndentTarget, _objectSpread(_objectSpread({}, props), {}, {
      child: child,
      index: index
    })), /*#__PURE__*/_react["default"].createElement(GroupItem, _objectSpread(_objectSpread({}, props), {}, {
      child: child,
      index: index,
      adding: adding,
      hover: hover
    })),
    /*index !== (tree.children.length-1) &&*/
    !child.children && /*#__PURE__*/_react["default"].createElement(_MoveTargets.FilterMoveTarget, _objectSpread(_objectSpread({}, props), {}, {
      child: child,
      index: index
    })));
  }, _fp["default"].toArray(node.children)), F.view(adding) && /*#__PURE__*/_react["default"].createElement(_AddPreview["default"], {
    onClick: function onClick() {
      tree.add(node.path, (0, _search.blankNode)());
    },
    join: node.join,
    style: {
      marginLeft: 0,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5
    }
  }))));
});

var _default = Group;
exports["default"] = _default;
//# sourceMappingURL=Group.js.map