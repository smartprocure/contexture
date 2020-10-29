"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterIndentTarget = void 0;

var _react = _interopRequireDefault(require("react"));

var _FilterDropTarget = _interopRequireDefault(require("./FilterDropTarget"));

var _styles = _interopRequireDefault(require("../../styles"));

var _search = require("../../utils/search");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Indent
var FilterIndentSpec = {
  drop: function drop(props, monitor) {
    var source = monitor.getItem();
    var isSelf = props.child === source.node;

    if (isSelf) {
      props.tree.remove(props.child);
    } else {
      var newGroup = (0, _search.indent)(props.tree, props.node, props.child, true);
      props.tree.move(source.node.path, {
        path: newGroup.path,
        index: 1
      });
    }
  }
};
var FilterIndentTarget = (0, _FilterDropTarget["default"])(FilterIndentSpec)(function (_ref) {
  var child = _ref.child,
      node = _ref.node,
      connectDropTarget = _ref.connectDropTarget,
      canDrop = _ref.canDrop,
      dragItem = _ref.dragItem;
  return connectDropTarget( /*#__PURE__*/_react["default"].createElement("div", null, !child.children && canDrop && /*#__PURE__*/_react["default"].createElement("div", {
    style: _objectSpread(_objectSpread({
      width: '50%',
      marginLeft: '50%',
      height: 50,
      position: 'fixed'
    }, dragItem.node === child ? _styles["default"].bgStriped : _styles["default"].bgPreview((0, _search.oppositeJoin)(node.join))), {}, {
      zIndex: 100
    })
  })));
});
exports.FilterIndentTarget = FilterIndentTarget;
//# sourceMappingURL=IndentTarget.js.map