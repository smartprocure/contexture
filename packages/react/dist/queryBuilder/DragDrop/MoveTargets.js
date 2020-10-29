"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterMoveTarget = exports.OperatorMoveTarget = void 0;

var _react = _interopRequireDefault(require("react"));

var _FilterDropTarget = _interopRequireDefault(require("./FilterDropTarget"));

var _styles = _interopRequireDefault(require("../../styles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Move
var FilterMoveSpec = {
  drop: function drop(props, monitor) {
    var _monitor$getItem = monitor.getItem(),
        node = _monitor$getItem.node;

    props.tree.move(node.path, {
      path: props.node.path,
      index: props.index
    });
  }
};

var FilterMoveDropTarget = function FilterMoveDropTarget(style) {
  return (0, _FilterDropTarget["default"])(FilterMoveSpec)(function (_ref) {
    var node = _ref.node,
        connectDropTarget = _ref.connectDropTarget,
        isOver = _ref.isOver,
        canDrop = _ref.canDrop;
    return connectDropTarget(canDrop ? /*#__PURE__*/_react["default"].createElement("div", {
      style: _objectSpread(_objectSpread({}, _styles["default"].bgPreview(node)), style({
        isOver: isOver
      }))
    }) : /*#__PURE__*/_react["default"].createElement("div", null));
  });
};

var OperatorMoveTarget = FilterMoveDropTarget(function () {
  return {
    width: "".concat(_styles["default"].operatorWidth, "px"),
    height: '100%'
  };
});
exports.OperatorMoveTarget = OperatorMoveTarget;
var FilterMoveTarget = FilterMoveDropTarget(function (_ref2) {
  var isOver = _ref2.isOver;
  return _objectSpread(_objectSpread({}, _styles["default"].w100), {}, {
    height: isOver ? '50px' : '15px',
    marginTop: '-15px'
  });
});
exports.FilterMoveTarget = FilterMoveTarget;
//# sourceMappingURL=MoveTargets.js.map